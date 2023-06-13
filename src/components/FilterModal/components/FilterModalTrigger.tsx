import { Trigger as DialogTrigger } from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

interface FilterModalTriggerProps {
  children: ReactNode;
}

export function FilterModalTrigger({ children }: FilterModalTriggerProps) {
  return <DialogTrigger asChild>{children}</DialogTrigger>;
}
