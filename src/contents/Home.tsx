import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { completedProposals, inProgressProposals, inReviewProposals, inVotingProposals } from '@/api/chain/proposals';
import proposalLifecycleImg from '@/assets/proposal-lifecycle.png';
import { Link } from '@/components/Link';
import { ProposalStatus } from '@/constants.ts';
import { useConfigData } from '@/hooks/useConfigData.ts';

interface HomeDashBoard {
  inReview: number;
  inVoting: number;
  inProgress: number;
  completed: number;
}

export function Home() {
  const { t } = useTranslation();
  const { configs } = useConfigData();

  const { data: stats, isLoading } = useQuery<HomeDashBoard>({
    queryKey: ['stats'],
    queryFn: () =>
      Promise.all([completedProposals(), inProgressProposals(), inVotingProposals(), inReviewProposals()]).then(
        ([completed, inProgress, inVoting, submitted]) => {
          return {
            inReview: submitted.length,
            inVoting: inVoting.length,
            inProgress: inProgress.length,
            completed: completed.length,
          };
        }
      ),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <header className="mx-auto my-44 flex max-w-[832px] flex-col items-center justify-center px-4 text-center">
        <h1 className="display-1 mb-8 text-high-contrast">{t('homeTitle')}</h1>
        <Link to="/proposals" variant="primary">
          {t('seeProposals')}
        </Link>
      </header>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-1 px-1 text-high-contrast md:grid-cols-4 md:grid-rows-4 md:px-4">
        <div className="order-1 col-span-2 rounded-xl bg-subtle p-12 md:order-none md:row-span-2">
          <h2 className="title-2">{t('homeDescription')}</h2>
        </div>
        <div className="order-4 col-span-1 flex flex-col justify-between rounded-xl bg-[#212C59] p-12 text-[#899CF8] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{isLoading ? <span className="animate-pulse">-</span> : stats?.inReview}</h2>
            <h3 className="label-2 mt-1">{ProposalStatus.REVIEW}</h3>
          </div>
          <div className="flex justify-end">
            <Link to="/proposals?status=in+review" square variant="secondary">
              <MdKeyboardArrowRight size={24} />
            </Link>
          </div>
        </div>
        <div className="order-5 col-span-1 flex flex-col justify-between gap-2 rounded-xl bg-[#4A250D] p-12 text-[#F09150] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{isLoading ? <span className="animate-pulse">-</span> : stats?.inVoting}</h2>
            <h3 className="label-2 m-1">{ProposalStatus.VOTING}</h3>
          </div>
          <div className="flex justify-end">
            <Link to="/proposals?status=in+voting" square variant="secondary">
              <MdKeyboardArrowRight size={24} />
            </Link>
          </div>
        </div>
        <div className="order-2 col-span-2 rounded-xl bg-subtle p-12 md:order-none md:row-span-1">
          <h2 className="label-2 mb-1">{t('operationalFunds')}</h2>
          <p className="title-2">
            {configs == null ? <span className="animate-pulse">-</span> : configs.available_funds}
          </p>
        </div>
        <div className="order-6 col-span-1 flex flex-col justify-between gap-2 rounded-xl bg-[#3F2353] p-12 text-[#B57DE9] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{isLoading ? <span className="animate-pulse">-</span> : stats?.inProgress}</h2>
            <h3 className="label-2 mt-1">{ProposalStatus.IN_PROGRESS}</h3>
          </div>
          <div className="flex justify-end">
            <Link to="/proposals?status=in+progress" square variant="secondary">
              <MdKeyboardArrowRight size={24} />
            </Link>
          </div>
        </div>
        <div className="order-7 col-span-1 flex flex-col justify-between gap-2 rounded-xl bg-[#213824] p-12 text-[#7BBF7C] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{isLoading ? <span className="animate-pulse">-</span> : stats?.completed}</h2>
            <h3 className="label-2 mt-1">{ProposalStatus.COMPLETE}</h3>
          </div>
          <div className="flex justify-end">
            <Link to="/proposals?status=completed" square variant="secondary">
              <MdKeyboardArrowRight size={24} />
            </Link>
          </div>
        </div>
        <div className="order-3 col-span-2 rounded-xl bg-subtle p-12 md:order-none md:row-span-1">
          <h2 className="label-2 mb-1">{t('additionalFunds')}</h2>
          <p className="title-2">
            {configs == null ? <span className="animate-pulse">-</span> : configs.additional_funds}
          </p>
        </div>
      </div>
      <div className="mt-44 flex flex-col items-center justify-center px-4 text-center text-high-contrast">
        <h2 className="display-2">{t('theProposalLifecycle')}</h2>
        <p className="body-1 m-4">{t('proposalLifecycleDescription')}</p>
        <img className="mb-30 mt-2 rounded-xl" src={proposalLifecycleImg} />
      </div>
    </>
  );
}
