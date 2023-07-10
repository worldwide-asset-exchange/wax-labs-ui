import { Action } from '@radix-ui/react-alert-dialog';
import { ReactNode } from 'react';

import { Button } from '@/components/Button';

interface AlertDialogActionProps {
  children: ReactNode;
  onClick?: () => void;
}

export function AlertDialogAction({ children, onClick }: AlertDialogActionProps) {
  return (
    <Action asChild>
      <Button variant="primary" onClick={onClick}>
        {children}
      </Button>
    </Action>
  );
}
