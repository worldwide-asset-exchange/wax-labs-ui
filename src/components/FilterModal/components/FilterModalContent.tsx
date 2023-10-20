import {
  Close as DialogClose,
  Content as DialogContent,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Title as DialogTitle,
} from '@radix-ui/react-dialog';
import { ReactNode } from 'react';
import { MdOutlineClose } from 'react-icons/md';

import { Button } from '@/components/Button';

interface FilterModalContentProps {
  title: string;
  children: ReactNode;
}

export function FilterModalContent({ title, children }: FilterModalContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay className="dialog-overlay" />
      <DialogContent className="dialog-content">
        <header className="dialog-header">
          <DialogClose asChild>
            <Button square variant="tertiary">
              <MdOutlineClose size={24} />
            </Button>
          </DialogClose>
          <DialogTitle className="dialog-title">{title}</DialogTitle>
        </header>
        {children}
      </DialogContent>
    </DialogPortal>
  );
}
