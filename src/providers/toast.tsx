import * as ToastPrimitive from '@radix-ui/react-toast';
import { ReactNode, useCallback, useState } from 'react';
import { MdOutlineCheckCircleOutline, MdOutlineClose, MdOutlineErrorOutline } from 'react-icons/md';

import { Button } from '@/components/Button';
import { Toast, ToastContext } from '@/contexts/toast';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const handleCloseToast = useCallback((toastIndex: number) => {
    setToasts(state => {
      state.splice(toastIndex, 1);
      return [...state];
    });
  }, []);

  return (
    <ToastContext.Provider value={{ setToasts }}>
      <ToastPrimitive.Provider>
        {children}
        {toasts.map((toast, toastIndex) => (
          <ToastPrimitive.Root
            key={toast.id}
            open={!!toast.id}
            onOpenChange={() => handleCloseToast(toastIndex)}
            className="flex min-w-[20rem] gap-3 rounded-md border border-subtle-light bg-app py-2 pl-5 pr-2 data-[state=open]:animate-slideIn"
          >
            {toast.variant && (
              <div className="flex-none py-3">
                {toast.variant === 'success' && <MdOutlineCheckCircleOutline size={24} className="text-[#7BBF7C]" />}
                {toast.variant === 'error' && <MdOutlineErrorOutline size={24} className="text-[#ED6E6D]" />}
              </div>
            )}
            <div className="flex-1 py-3">
              {toast.title && (
                <ToastPrimitive.Title className="label-1 text-high-contrast">{toast.title}</ToastPrimitive.Title>
              )}
              <ToastPrimitive.Description className="body-2 text-low-contrast">
                {toast.description}
              </ToastPrimitive.Description>
              {toast.action && toast.altText && (
                <ToastPrimitive.Action asChild altText={toast.altText}>
                  {toast.action}
                </ToastPrimitive.Action>
              )}
            </div>
            <div className="flex-none">
              <ToastPrimitive.Close aria-label="Close">
                <Button variant="link" square>
                  <MdOutlineClose size={24} />
                </Button>
              </ToastPrimitive.Close>
            </div>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed right-8 top-8 z-50 flex flex-col-reverse gap-2 focus:ring-0" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
