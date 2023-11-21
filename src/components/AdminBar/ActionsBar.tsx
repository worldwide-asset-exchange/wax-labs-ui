import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'react-i18next';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

import { CancelProposal } from '@/components/AdminBar/proposalStates/CancelProposal.tsx';
import { Delete } from '@/components/AdminBar/proposalStates/Delete.tsx';
import { RejectProposal } from '@/components/AdminBar/proposalStates/RejectProposal.tsx';
import { SubmitProposal } from '@/components/AdminBar/proposalStates/SubmitProposal.tsx';
import { UpdateReviewer } from '@/components/AdminBar/proposalStates/UpdateReviewer.tsx';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link.tsx';
import { useActionsBar } from '@/hooks/useActionsBar';

import { ApproveProposal } from './proposalStates/ApproveProposal';
import { AskForChanges } from './proposalStates/AskForChanges';
import { BeginVoting } from './proposalStates/BeginVoting';
import { CommunityVoting } from './proposalStates/CommunityVoting';
import { EndVoting } from './proposalStates/EndVoting';

export function ActionsBar() {
  const { t } = useTranslation();

  const {
    showEdit,
    showSubmit,
    showUpdateReviewer,
    showApprove,
    showBeginVoting,
    showEndVoting,
    showCancelProposal,
    showDelete,
    showReject,
  } = useActionsBar();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">
          {t('actions')}
          <MdOutlineKeyboardArrowDown size={24} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          className="flex max-w-xs flex-col rounded-lg border border-subtle-light bg-app p-3 focus:ring-0"
        >
          {showEdit && (
            <DropdownMenu.Item asChild>
              <Link to="edit?step=1" square>
                {t('edit')}
              </Link>
            </DropdownMenu.Item>
          )}

          {showSubmit && (
            <DropdownMenu.Item asChild>
              <SubmitProposal />
            </DropdownMenu.Item>
          )}

          {showUpdateReviewer && (
            <DropdownMenu.Item asChild>
              <UpdateReviewer />
            </DropdownMenu.Item>
          )}

          {showApprove && (
            <>
              <DropdownMenu.Item asChild>
                <ApproveProposal />
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <CommunityVoting />
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <AskForChanges />
              </DropdownMenu.Item>
            </>
          )}

          {showReject && (
            <DropdownMenu.Item asChild>
              <RejectProposal />
            </DropdownMenu.Item>
          )}

          {showBeginVoting && (
            <DropdownMenu.Item asChild>
              <BeginVoting />
            </DropdownMenu.Item>
          )}

          {showEndVoting && (
            <DropdownMenu.Item asChild>
              <EndVoting />
            </DropdownMenu.Item>
          )}

          {showCancelProposal && (
            <DropdownMenu.Item asChild>
              <CancelProposal />
            </DropdownMenu.Item>
          )}

          {showDelete && (
            <DropdownMenu.Item asChild>
              <Delete />
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
