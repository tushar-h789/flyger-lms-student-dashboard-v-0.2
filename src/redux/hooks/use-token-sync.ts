'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/auth/auth-slice';
import { AppDispatch } from '../store';

/**
 * Hook to sync token from client-readable cookie to Redux state
 * This ensures the token is available in Redux state throughout the app
 */
export function useTokenSync() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Get token from cookie and sync to Redux
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('logto_access_token='));
    
    if (cookie) {
      const token = cookie.split('=')[1];
      if (token) {
        dispatch(setToken(token));
        console.log('✅ Token synced to Redux state');
      }
    }
  }, [dispatch]);

  // Cleanup on unmount (optional)
  useEffect(() => {
    return () => {
      // Cleanup logic if needed
    };
  }, []);
}
