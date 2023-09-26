import { ActionsBar } from '@/components/AdminBar';
import { StatusTag } from '@/components/StatusTag';
import { useAdminProposalBar } from '@/hooks/useAdminProposalBar';

export function AdminProposalBar() {
  const { status } = useAdminProposalBar();

  return (
    <div className="bg-subtle">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <div className="flex-none">
          <StatusTag status={status} />
        </div>
        <div className="flex-none">
          <ActionsBar />
        </div>
      </div>
    </div>
  );
}
