'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import SessionProvider from '@/components/SessionProvider';

export default function ReduxProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <Provider store={store}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </Provider>
  );
} 