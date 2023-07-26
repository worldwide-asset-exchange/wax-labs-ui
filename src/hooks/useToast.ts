import { useContext } from 'react';

import { Toast, ToastContext } from '@/contexts/toast';

type ToastProps = Omit<Toast, 'id'>;

export function useToast() {
  const { setToasts } = useContext(ToastContext);

  function toast({ title, description, variant }: ToastProps) {
    setToasts(state => [
      ...state,
      {
        id: Math.random(),
        title,
        description,
        variant,
      },
    ]);
  }

  return {
    toast,
  };
}
