import { zodResolver } from '@hookform/resolvers/zod';
import {
  Close as DialogClose,
  Content as DialogContent,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from '@radix-ui/react-dialog';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineClose } from 'react-icons/md';
import { z } from 'zod';

import { reviewDeliverable } from '@/api/chain/reviewer';
import { Deliverables } from '@/api/models/deliverables.ts';
import { Proposal } from '@/api/models/proposal.ts';
import { refreshStatus } from '@/api/notifications.ts';
import { Button } from '@/components/Button.tsx';
import { Input } from '@/components/Input.tsx';
import { DeliverableStatusKey } from '@/constants.ts';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';

export function ReviewDeliverable({
  proposal,
  deliverable,
  onChange,
}: {
  proposal: Proposal;
  deliverable: Deliverables;
  onChange: (status: DeliverableStatusKey) => void;
}) {
  const { t } = useTranslation();
  const { actor, session } = useChain();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const ReviewDeliverableValidationSchema = useMemo(() => {
    return z.object({
      review: z.string().url().nonempty(t('messageErrorEmpty')!).min(1),
    });
  }, [t]);

  type ReviewDeliverableValidation = z.input<typeof ReviewDeliverableValidationSchema>;

  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<ReviewDeliverableValidation>({
    resolver: zodResolver(ReviewDeliverableValidationSchema),
  });

  if (proposal.reviewer !== actor || deliverable.status !== DeliverableStatusKey.REPORTED) {
    return null;
  }
  const onReviewDeliverable = async ({ review, accept }: { review: string; accept: boolean }) => {
    try {
      await reviewDeliverable({
        session: session!,
        proposalId: proposal.proposal_id,
        deliverableId: deliverable.deliverable_id!,
        accept,
        review,
      });
      await refreshStatus(proposal!.proposal_id);

      toast({ description: t('admin.submitReport.submitReportSuccess'), variant: 'success' });

      onChange(accept ? DeliverableStatusKey.ACCEPTED : DeliverableStatusKey.REJECTED);
    } catch (e) {
      console.log('onReviewDeliverable error', e);
    }
  };

  return (
    <div className="flex w-full justify-end pt-8">
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        {t('reviewReport')}
      </Button>

      <DialogRoot
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(false);
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
              <DialogTitle className="title-3 text-high-contrast">{t('')}</DialogTitle>
            </header>

            <form>
              <fieldset className="flex flex-col gap-1 p-4">
                <Input
                  {...register('review')}
                  error={errors.review?.message}
                  label={t('admin.reviewReport.reviewReportLabel')!}
                  placeholder={t('admin.reviewReport.reviewReportPlaceholder')!}
                  maxLength={1000}
                  type={'text'}
                />
              </fieldset>
              <footer className="flex items-center justify-between p-4">
                <Button
                  variant="tertiary"
                  disabled={!isDirty}
                  onClick={handleSubmit(({ review }) =>
                    onReviewDeliverable({
                      accept: false,
                      review,
                    })
                  )}
                >
                  {t('admin.reviewReport.rejectReportLabel')}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!isDirty}
                  onClick={handleSubmit(({ review }) =>
                    onReviewDeliverable({
                      accept: true,
                      review,
                    })
                  )}
                >
                  {t('admin.reviewReport.approveReportLabel')}
                </Button>
              </footer>
            </form>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </div>
  );
}
