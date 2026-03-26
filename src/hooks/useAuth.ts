"use client";

import { useAppDispatch, useAppSelector } from "../store/storeHooks";
import { logout, setCredentials } from "../store/slices/authSlice";
import { useLoginMutation, useGetMeQuery } from "../store/services/authService";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector((state: any) => state.auth);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  
  // Conditionally skip query if no token
  const { data: meData, isError } = useGetMeQuery(undefined, {
    skip: !token || isAuthenticated, 
  });

  useEffect(() => {
    if (meData?.data) {
      dispatch(setCredentials({ user: meData.data, token }));
    }
    if (isError) {
      dispatch(logout());
    }
  }, [meData, isError, dispatch, token]);

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
