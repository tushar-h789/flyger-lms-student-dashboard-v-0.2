'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { setToken } from './features/auth/auth-slice';
import { AppDispatch } from './store';

/**
 * Component to sync token from cookie to Redux state
 */
function TokenSyncProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Get token from client-readable cookie and sync to Redux state
    const getCookieToken = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
      return null;
    };

    const token = getCookieToken('logto_access_token');
    if (token) {
      dispatch(setToken(token));
      console.log('✅ Token synced to Redux state on app load');
    }
  }, [dispatch]);

  return <>{children}</>;
}

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <TokenSyncProvider>{children}</TokenSyncProvider>
    </Provider>
  );
};