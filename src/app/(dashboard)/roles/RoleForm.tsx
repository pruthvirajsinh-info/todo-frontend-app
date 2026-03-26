"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGetPermissionsQuery, useGetModulesQuery, useGetActionsQuery } from "@/store/services/permissionService";
import { useMemo } from "react";

const roleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(255).optional(),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormProps {
  initialData?: any;
  onSubmit: (data: RoleFormData) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

export default function RoleForm({ initialData, onSubmit, isLoading, isEdit }: RoleFormProps) {
  const router = useRouter();
  const { data: permissionsData } = useGetPermissionsQuery();
  const { data: modulesData } = useGetModulesQuery();
  const { data: actionsData } = useGetActionsQuery();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || "",
      permissions: initialData.rolePermissions?.map((rp: any) => rp.permissionId) || [],
    } : { permissions: [] },
  });

  const selectedPermissions = watch("permissions");

  const togglePermission = (id: string) => {
    const current = [...selectedPermissions];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValue("permissions", current, { shouldValidate: true });
  };

  // Group permissions by module and action
  const permissionGrid = useMemo(() => {
    if (!modulesData?.data || !actionsData?.data || !permissionsData?.data) return [];
    
    return modulesData.data.map((m: any) => ({
      module: m,
      actions: actionsData.data.map((a: any) => {
        const perm = permissionsData.data.find((p: any) => p.name === `${m.name}:${a.name}`);
        return { 
          action: a, 
          permissionId: perm?.id,
          exists: !!perm
        };
      })
    }));
  }, [modulesData, actionsData, permissionsData]);

  const handleFormSubmit = async (data: RoleFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handled by parent
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/roles"
          className="p-3 glass-hover rounded-2xl text-muted-foreground hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gradient">{isEdit ? "Edit Role" : "Create New Role"}</h2>
          <p className="text-muted-foreground mt-1">Configure permissions for this user group.</p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Role Name</label>
              <input
                {...register("name")}
                placeholder="e.g. Project Manager"
                disabled={isEdit && initialData?.name === 'superadmin'}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Description</label>
              <input
                {...register("description")}
                placeholder="Brief description of this role's purpose"
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xl font-bold">Permissions Matrix</h3>
            {errors.permissions && <p className="text-sm text-destructive font-medium">{errors.permissions.message}</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-4 px-4 text-sm font-semibold text-muted-foreground">Module</th>
                  {actionsData?.data?.map((a: any) => (
                    <th key={a.id} className="py-4 px-4 text-sm font-semibold text-muted-foreground capitalize text-center">
                      {a.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {permissionGrid.map((row: any) => (
                  <tr key={row.module.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-medium capitalize">{row.module.name}</td>
                    {row.actions.map((act: any) => (
                      <td key={act.action.id} className="py-4 px-4 text-center">
                        {act.exists ? (
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(act.permissionId)}
                            onChange={() => togglePermission(act.permissionId)}
                            className="w-5 h-5 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/20 cursor-pointer"
                          />
                        ) : (
                          <div className="text-[10px] text-muted-foreground opacity-30 italic">N/A</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <Info size={18} className="text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Permissions are additive. If a user has multiple roles, they gain the union of all permissions assigned to those roles. 
              The <strong>superadmin</strong> role always bypasses permission checks.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 p-6 glass rounded-3xl border border-white/10">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl font-semibold glass-hover text-muted-foreground transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || (isEdit && initialData?.name === 'superadmin')}
            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <Save size={20} />
                <span>{isEdit ? "Save Changes" : "Create Role"}</span>
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
