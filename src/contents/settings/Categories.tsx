import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { addCategory, deleteCategory } from '@/api/chain/category';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useChain } from '@/hooks/useChain';
import { useConfigData } from '@/hooks/useConfigData.ts';
import { useToast } from '@/hooks/useToast';

export function Categories() {
  const { t } = useTranslation();
  const { session } = useChain();
  const { configs, reFetch } = useConfigData();
  const { toast } = useToast();

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const CategorySchema = useMemo(() => {
    return z.object({
      category: z.string().nonempty(t('waxAccountErrorEmpty')!).min(1),
    });
  }, [t]);

  type Category = z.input<typeof CategorySchema>;

  // const openConfirmationModal = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   setConfirmationModalOpen(true);
  // };

  const addNewCategory = () => {
    const data = getValues();

    addCategory({ category: data.category, session: session! })
      .then(() => {
        reFetch();
        toast({ description: t('addCategorySuccess'), variant: 'success' });
        reset();
      })
      .catch(e => toast({ description: e.message, variant: 'error' }));
  };

  const deleteExistingCategory = (category: string) => {
    deleteCategory({ category: category, session: session! })
      .then(() => reFetch())
      .then(() => {
        reFetch();
        toast({ description: t('deleteCategorySuccess'), variant: 'success' });
        reset();
      })
      .catch(e => toast({ description: e.message, variant: 'error' }));
  };

  const {
    register,
    getValues,
    reset,
    formState: { isDirty, errors },
  } = useForm<Category>({ resolver: zodResolver(CategorySchema) });

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="title-2 mt-8 px-4 py-8 text-high-contrast">{t('categories')}</h2>
      <div className="max-w-5xl px-1 md:px-4">
        <form onSubmit={addNewCategory} className="flex gap-6 rounded-xl bg-subtle p-8">
          <div className="flex-1">
            <Input
              {...register('category')}
              error={errors.category?.message}
              label={t('categoryName')!}
              placeholder={t('categoryNamePlaceholder')!}
              maxLength={64}
            />
          </div>
          <div className="flex-none pt-8">
            <Button variant="primary" type="submit" disabled={!isDirty}>
              {t('add')}
            </Button>
          </div>
        </form>
        <div className="mt-4 divide-y divide-subtle-light rounded-xl bg-subtle">
          {configs?.categories.map(category => (
            <div key={category} className="flex items-center justify-between gap-6 px-8 py-4">
              <p className="body-1 text-high-contrast">{category}</p>
              <Button
                onClick={() => {
                  deleteExistingCategory(category);
                }}
                variant="tertiary"
              >
                {t('delete')}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <AlertDialog.Root
        open={confirmationModalOpen}
        onOpenChange={setConfirmationModalOpen}
        title={t('transferAdminRole')}
        description={t('transferAdminRoleConfirmation')}
      >
        {/* <AlertDialog.Action onClick={deleteExistingCategory}>{t('transfer')}</AlertDialog.Action> */}
        <AlertDialog.Cancel>{t('cancel')}</AlertDialog.Cancel>
      </AlertDialog.Root>
    </div>
  );
}
