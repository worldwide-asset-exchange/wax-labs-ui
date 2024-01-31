import { useQuery } from '@tanstack/react-query';

import { deliverables as getDeliverables } from '@/api/chain/proposals';

export function useDeliverables({ proposalId }: { proposalId: number }) {
  return useQuery({
    queryKey: ['proposal', proposalId, 'deliverables'],
    queryFn: () => getDeliverables({ proposalId }).then(response => response.deliverables),
    enabled: !!proposalId,
  });
}
