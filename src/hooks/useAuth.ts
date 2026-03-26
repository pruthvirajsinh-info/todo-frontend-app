"use client";

import { useAppDispatch, useAppSelector } from "../store/storeHooks";
import { logout, setCredentials, initializeAuth } from "../store/slices/authSlice";
import { useLoginMutation, useGetMeQuery } from "../store/services/authService";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isInitialized } = useAppSelector((state: any) => state.auth);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [isFetchingToken, setIsFetchingToken] = useState(true);
  
  // 1. Initialize from localStorage once on mount
  useEffect(() => {
    dispatch(initializeAuth());
    setIsFetchingToken(false);
  }, [dispatch]);

  // 2. Fetch user profile if we have a token but no user object
  const { data: meData, isError, isFetching: isFetchingMe } = useGetMeQuery(undefined, {
    skip: !isInitialized || !token || !!user, 
  });

  useEffect(() => {
    if (meData?.data) {
      // Sync user data to store
      dispatch(setCredentials({ user: meData.data, token: token! }));
    }
    if (isError) {
      dispatch(logout());
    }
  }, [meData, isError, dispatch, token]);

  const handleLogin = async (credentials: any) => {
    try {
      const response = await loginMutation(credentials).unwrap();
      if (response.data) {
        dispatch(setCredentials(response.data));
        return response.data;
      }
      return response;
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
    isAuthenticated: !!user,
    isLoggingIn,
    // Loading state for initial session restoration
    isInitialLoading: isFetchingToken || !isInitialized || (!!token && !user && isFetchingMe),
    login: handleLogin,
    logout: handleLogout,
  };
};
