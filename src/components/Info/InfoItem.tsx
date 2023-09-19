import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { StatusTag } from '@/components/StatusTag';
import { toProposalStatus } from '@/utils/proposalUtils.ts';

interface InfoItemProps {
  children: ReactNode;
  label: string;
  value?: string | ReactNode;
  className?: string;
  status?: number;
}

export function InfoItem({ children, label, value, status, className }: InfoItemProps) {
  return (
    <div className={twMerge('flex items-center gap-4 py-4', className)}>
      <div className="flex-none text-low-contrast">{children}</div>
      <h4 className="label-2 flex-1 text-low-contrast">{label}</h4>
      {value && <p className="label-1 flex-1 text-right text-high-contrast">{value}</p>}
      {status && (
        <div className="my-[-0.4375rem]">
          <StatusTag status={toProposalStatus(status)} />
        </div>
      )}
    </div>
  );
}
