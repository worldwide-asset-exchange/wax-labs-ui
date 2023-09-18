import { zodResolver } from '@hookform/resolvers/zod';
import {
  Close as DialogClose,
  Content as DialogContent,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineClose } from 'react-icons/md';
import { z } from 'zod';

import { Button } from '@/components/Button.tsx';
import { Editor } from '@/components/Editor.tsx';
import { Input } from '@/components/Input.tsx';

export interface InputDialogProps {
  defaultValue?: string;
  label: string;
  maxLength?: number;
  onSubmit: (data: { value: string }) => void;
  onClose: (closed: boolean) => void;
  open: boolean;
  placeholder?: string;
  title: string;
  type?: 'text' | 'number' | 'textarea';
  disableOnDirty?: boolean;
}

export function InputDialog({
  title,
  label,
  placeholder,
  maxLength,
  defaultValue,
  open,
  type,
  onSubmit,
  onClose,
  disableOnDirty = false,
}: InputDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const GenericValidationSchema = useMemo(() => {
    return z.object({
      value: z.string().nonempty(t('admin.reviewer.waxMessageErrorEmpty')!).min(1),
    });
  }, [t]);

  type GenericValidation = z.input<typeof GenericValidationSchema>;

  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, errors },
    control,
  } = useForm<GenericValidation>({
    defaultValues: {
      value: defaultValue,
    },
    resolver: zodResolver(GenericValidationSchema),
  });

  const handleResetField = () => {
    reset();
  };

  const onFormSubmit = (values: GenericValidation) => {
    setIsOpen(false);
    onClose(true);
    onSubmit(values);
    reset();
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        onClose(true);
        reset();
      }}
    >
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

          <form onSubmit={handleSubmit(onFormSubmit)}>
            <fieldset className="flex flex-col gap-1 p-4">
              {type === 'textarea' ? (
                <Controller
                  control={control}
                  name="value"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Editor label={label} onChange={onChange} value={value} error={error?.message} />
                  )}
                />
              ) : (
                <Input
                  {...register('value')}
                  error={errors.value?.message}
                  label={label}
                  placeholder={placeholder}
                  maxLength={maxLength ?? 12}
                  type={type ?? 'text'}
                />
              )}
            </fieldset>
            <footer className="flex items-center justify-between p-4">
              <Button variant="tertiary" onClick={handleResetField}>
                {t('reset')}
              </Button>
              <Button variant="primary" type="submit" disabled={disableOnDirty ? !isDirty : false}>
                {t('apply')}
              </Button>
            </footer>
          </form>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
