"use client";

import { Provider } from "react-redux";
import { store } from "./store.js";
import { Toaster } from "sonner";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </Provider>
  );
}
