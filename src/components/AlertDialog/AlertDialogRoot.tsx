import { Content, Description, Overlay, Portal, Root, Title } from '@radix-ui/react-alert-dialog';
import { ReactNode } from 'react';

interface AlertDialogRootProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  title: string;
  description: string;
  children: ReactNode;
}

export function AlertDialogRoot({ open, onOpenChange, title, description, children }: AlertDialogRootProps) {
  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Overlay className="fixed inset-0 z-40 block bg-app/50" />
        <Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md bg-subtle p-8 shadow-2xl">
          <Title className="title-3 mb-3 text-high-contrast">{title}</Title>
          <Description className="body-2 mb-4 text-low-contrast">{description}</Description>
          <div className="flex flex-wrap gap-4">{children}</div>
        </Content>
      </Portal>
    </Root>
  );
}
