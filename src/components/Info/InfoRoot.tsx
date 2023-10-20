import { forwardRef, ReactNode, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface InfoRootProps {
  children: ReactNode;
  className?: string;
}

function InfoRootComponent({ children, className }: InfoRootProps, ref: Ref<HTMLElement>) {
  return (
    <section ref={ref} className={twMerge('divide-y divide-subtle-light', className)}>
      {children}
    </section>
  );
}

export const InfoRoot = forwardRef(InfoRootComponent);
