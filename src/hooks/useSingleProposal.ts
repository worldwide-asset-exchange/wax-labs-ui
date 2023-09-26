import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { proposalContentData, proposalStatusComment, singleProposal } from '@/api/chain/proposals';
import { Proposal } from '@/api/models/proposal';
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

  const data = useQuery({
    queryKey: ['proposal', proposalId, isAuthenticated],
    queryFn: async () => {
      const [proposalData, contentData, comments] = await Promise.all([
        singleProposal({ proposalId }),
        proposalContentData({ proposalId }),
        isAuthenticated ? proposalStatusComment({ proposalId }) : Promise.resolve(null),
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

      return {
        ...proposalData,
        content: contentData?.content ?? '',
        statusComment: comments?.status_comment ?? '',
      } as Proposal & { content: string; statusComment: string };
    },
    enabled: !!proposalId,
  });

  return data;
}
