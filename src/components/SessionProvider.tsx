'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { checkSession } from '@/redux/features/authSlice';

export default function SessionProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return <>{children}</>;
} 