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
      <DialogOverlay className="fixed inset-0 z-40 block bg-app/50" />
      <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-screen w-full -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-subtle shadow-2xl data-[state=closed]:hidden md:max-w-lg md:rounded-md max-md:h-full">
        <header className="sticky top-0 flex items-center gap-4 border-b border-subtle-light bg-subtle px-4 py-2">
          <DialogClose asChild>
            <Button square variant="tertiary">
              <MdOutlineClose size={24} />
            </Button>
          </DialogClose>
          <DialogTitle className="title-3 text-high-contrast">{title}</DialogTitle>
        </header>
        {children}
      </DialogContent>
    </DialogPortal>
  );
}
