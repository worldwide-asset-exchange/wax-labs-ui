import { Cancel } from '@radix-ui/react-alert-dialog';
import { ReactNode } from 'react';

import { Button } from '@/components/Button';

interface AlertDialogCancelProps {
  children: ReactNode;
  onClick?: () => void;
}

export function AlertDialogCancel({ children, onClick }: AlertDialogCancelProps) {
  return (
    <Cancel asChild>
      <Button variant="tertiary" onClick={onClick}>
        {children}
      </Button>
    </Cancel>
  );
}
