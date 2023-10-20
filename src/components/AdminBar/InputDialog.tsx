import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
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
  zodValidation?: z.ZodString;
  zodValidationMessage?: string;
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
  disableOnDirty,
  zodValidation,
  zodValidationMessage,
}: InputDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const GenericValidationSchema = useMemo(() => {
    return z.object({
      value:
        zodValidation ||
        z
          .string()
          .nonempty(zodValidationMessage || t('messageErrorEmpty')!)
          .min(1),
    });
  }, [t, zodValidation, zodValidationMessage]);

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
    <Dialog.Root
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        onClose(true);
        reset();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <header className="dialog-header">
            <Dialog.Close asChild>
              <Button square variant="tertiary">
                <MdOutlineClose size={24} />
              </Button>
            </Dialog.Close>
            <Dialog.Title className="dialog-title">{title}</Dialog.Title>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
