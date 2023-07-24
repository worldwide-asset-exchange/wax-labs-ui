import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface InfoItemProps {
  children: ReactNode;
  label: string;
  value: string | undefined;
  className?: string;
}

export function InfoItem({ children, label, value, className }: InfoItemProps) {
  return (
    <div className={twMerge('flex items-center gap-4 py-4', className)}>
      <div className="flex-none text-low-contrast">{children}</div>
      <h4 className="label-2 flex-1 text-low-contrast">{label}</h4>
      <p className="label-1 flex-1 text-right text-high-contrast">{value}</p>
    </div>
  );
}
