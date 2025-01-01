'use client';

import type * as React from 'react';
import { useSession } from './client';
type AuthProviderProps = {
  readonly children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // initialize auth store
  useSession();
  return children;
};
