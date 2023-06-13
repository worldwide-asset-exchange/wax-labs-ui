import { Root as DialogRoot } from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

interface FilterModalRootProps {
  children: ReactNode;
}

export function FilterModalRoot({ children }: FilterModalRootProps) {
  return <DialogRoot>{children}</DialogRoot>;
}
