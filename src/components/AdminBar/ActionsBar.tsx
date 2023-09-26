import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'react-i18next';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

import { Approve } from '@/components/AdminBar/proposalStates/Approve.tsx';
import { CancelProposal } from '@/components/AdminBar/proposalStates/CancelProposal.tsx';
import { Delete } from '@/components/AdminBar/proposalStates/Delete.tsx';
import { SubmitProposal } from '@/components/AdminBar/proposalStates/SubmitProposal.tsx';
import { UpdateReviewer } from '@/components/AdminBar/proposalStates/UpdateReviewer.tsx';
import { Voting } from '@/components/AdminBar/proposalStates/Voting.tsx';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link.tsx';
import { useActionsBar } from '@/hooks/useActionsBar';

export function ActionsBar() {
  const { t } = useTranslation();

  const { showEdit, showSubmit, showUpdateReviewer, showApprove, showVoting, showCancelProposal, showDelete } =
    useActionsBar();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">
          Actions
          <MdOutlineKeyboardArrowDown size={24} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="max-w-xs rounded-lg border border-subtle-light bg-app p-3 focus:ring-0">
          {showEdit && (
            <DropdownMenu.Item>
              <Link to="edit?step=1" square>
                {t('edit')}
              </Link>
            </DropdownMenu.Item>
          )}

          {showSubmit && (
            <DropdownMenu.Item>
              <SubmitProposal />
            </DropdownMenu.Item>
          )}

          {showUpdateReviewer && (
            <DropdownMenu.Item>
              <UpdateReviewer />
            </DropdownMenu.Item>
          )}

          {showApprove && (
            <DropdownMenu.Item>
              <Approve />
            </DropdownMenu.Item>
          )}

          {showVoting && (
            <DropdownMenu.Item>
              <Voting />
            </DropdownMenu.Item>
          )}

          {showCancelProposal && (
            <DropdownMenu.Item>
              <CancelProposal />
            </DropdownMenu.Item>
          )}

          {showDelete && (
            <DropdownMenu.Item>
              <Delete />
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
