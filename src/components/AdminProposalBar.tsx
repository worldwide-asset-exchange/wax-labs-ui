import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { MdOutlineClose, MdOutlineCommentBank } from 'react-icons/md';

import { ActionsBar } from '@/components/AdminBar';
import { StatusTag } from '@/components/StatusTag';
import { useActionsBar } from '@/hooks/useActionsBar';
import { useChain } from '@/hooks/useChain';
import { useSingleProposal } from '@/hooks/useSingleProposal';
import { toProposalStatus } from '@/utils/proposalUtils';

import { Button } from './Button';

export function AdminProposalBar() {
  const { actor } = useChain();
  const { data: proposal } = useSingleProposal();
  const { t } = useTranslation();
  const { showActionButton } = useActionsBar();

  const status = toProposalStatus(proposal!.status);

  return (
    <div className="bg-subtle">
      <div className="mx-auto flex max-w-5xl items-center gap-4 p-4">
        <div className="flex-1">
          <StatusTag status={status} />
        </div>
        {proposal?.statusComment && actor === proposal?.proposer && (
          <div className="flex-none">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button variant="tertiary" square>
                  <MdOutlineCommentBank size={24} />
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="dialog-content">
                  <header className="dialog-header">
                    <Dialog.Close asChild>
                      <Button square variant="tertiary">
                        <MdOutlineClose size={24} />
                      </Button>
                    </Dialog.Close>
                    <Dialog.Title className="dialog-title">{t('latestStatusComment')}</Dialog.Title>
                  </header>
                  <Dialog.Description
                    className="body-2 p-4 text-low-contrast"
                    dangerouslySetInnerHTML={{
                      __html: proposal.statusComment,
                    }}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        )}
        {showActionButton && (
          <div className="flex-none">
            <ActionsBar />
          </div>
        )}
      </div>
    </div>
  );
}
