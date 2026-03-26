"use client";

import { useAppDispatch, useAppSelector } from "../store/storeHooks";
import { logout, setCredentials } from "../store/slices/authSlice";
import { useLoginMutation } from "../store/services/authService";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector((state: any) => state.auth);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleLogin = async (credentials: any) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      dispatch(setCredentials(result));
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoggingIn,
    login: handleLogin,
    logout: handleLogout,
  };
};
