import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { accountProfile } from '@/api/chain/profile';
import { proposalContentData, proposalStatusComment, singleProposal } from '@/api/chain/proposals';
import { Profile } from '@/api/models/profile.ts';
import { Proposal } from '@/api/models/proposal';
import { queryClient } from '@/api/queryClient';
import { ProposalStatusKey } from '@/constants';
import { useChain } from '@/hooks/useChain.ts';
import { useToast } from '@/hooks/useToast.ts';
import { imageExists } from '@/utils/image';

export function useSingleProposal() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const params = useParams();
  const proposalId = Number(params.proposalId);
  const { isAuthenticated } = useChain();
  const { toast } = useToast();

  const queryKey = ['proposal', proposalId, isAuthenticated];

  const result = useQuery({
    queryKey,
    queryFn: async () => {
      const [proposalData, contentData, comments] = await Promise.all([
        singleProposal({ proposalId }),
        proposalContentData({ proposalId }),
        proposalStatusComment({ proposalId }),
      ]);

      if (!proposalData) {
        toast({ description: t('proposalNotFound'), variant: 'error' });
        navigate('/proposals');
        return Promise.reject(t('proposalNotFound'));
      }

      if (proposalData?.image_url) {
        try {
          await imageExists(proposalData.image_url);
        } catch (e) {
          proposalData.image_url = '';
        }
      }

      let profile = null;
      if (proposalData?.proposer) {
        try {
          profile = await accountProfile(proposalData?.proposer);
        } catch {
          //   We don't care if we don't find the proposer data
        }
      }

      return {
        ...proposalData,
        content: contentData?.content ?? '',
        statusComment: comments?.status_comment ?? '',
        proposerProfile: profile,
      } as Proposal & { content: string; statusComment: string; proposerProfile: Profile };
    },
    enabled: !!proposalId,
  });

  async function onChangeStatus(status: ProposalStatusKey) {
    result!.data!.status = status;
    queryClient.setQueriesData(queryKey, result.data);
  }

  return {
    ...result,
    onChangeStatus,
  };
}
