import { createContext, Dispatch, ReactNode, SetStateAction } from 'react';

import { noop } from '@/utils/common.ts';

export interface Toast {
  id: number;
  title?: string;
  description: string;
  action?: ReactNode;
  altText?: string;
  variant?: 'success' | 'error';
}

type SetToasts = Dispatch<SetStateAction<Toast[]>>;

interface CreateContextProps {
  setToasts: SetToasts;
}

export const ToastContext = createContext<CreateContextProps>({
  setToasts: noop,
});
