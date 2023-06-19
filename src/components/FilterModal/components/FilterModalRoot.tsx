import { Root as DialogRoot } from '@radix-ui/react-dialog';
import { forwardRef, ReactNode, Ref, useImperativeHandle, useState } from 'react';

import { FilterModalRootRef } from '../FilterModalRootRef';

interface FilterModalRootProps {
  children: ReactNode;
}

function FilterModalRootComponent({ children }: FilterModalRootProps, ref: Ref<FilterModalRootRef>) {
  const [open, setOpen] = useState(false);

  function onOpen() {
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        onOpen,
        onClose,
      };
    },
    []
  );

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      {children}
    </DialogRoot>
  );
}

export const FilterModalRoot = forwardRef(FilterModalRootComponent);
