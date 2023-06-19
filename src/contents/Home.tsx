import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowRight } from 'react-icons/md';

import {
  completedProposals,
  configData,
  inProgressProposals,
  inReviewProposals,
  inVotingProposals,
} from '@/api/chain/proposals';
import proposalLifecycleImg from '@/assets/proposal-lifecycle.png';
import { Link } from '@/components/Link';
import { ProposalStatus } from '@/constants.ts';

interface HomeDashBoard {
  inReview: number;
  inVoting: number;
  inProgress: number;
  completed: number;
  operationalFunds: string;
  additionalFunds: string;
}

export function Home() {
  const [stats, setStats] = useState<HomeDashBoard>({} as HomeDashBoard);

  const { t } = useTranslation();

  useEffect(() => {
    Promise.all([
      completedProposals(),
      inProgressProposals(),
      inVotingProposals(),
      inReviewProposals(),
      configData(),
    ]).then(([completed, inProgress, inVoting, submitted, configData]) => {
      setStats({
        inReview: submitted.length,
        inVoting: inVoting.length,
        inProgress: inProgress.length,
        completed: completed.length,
        operationalFunds: configData.display_available_funds,
        additionalFunds: configData.display_additional_funds,
      });
    });
  }, []);

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
            <h2 className="display-1">{stats.inReview ?? 0}</h2>
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
            <h2 className="display-1">{stats.inVoting ?? 0}</h2>
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
          <p className="title-2">{stats.operationalFunds ?? 0}</p>
        </div>
        <div className="order-6 col-span-1 flex flex-col justify-between gap-2 rounded-xl bg-[#3F2353] p-12 text-[#B57DE9] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{stats.inProgress ?? 0}</h2>
            <h3 className="label-2 mt-1">{ProposalStatus.PROGRESS}</h3>
          </div>
          <div className="flex justify-end">
            <Link to="/proposals?status=in+progress" square variant="secondary">
              <MdKeyboardArrowRight size={24} />
            </Link>
          </div>
        </div>
        <div className="order-7 col-span-1 flex flex-col justify-between gap-2 rounded-xl bg-[#213824] p-12 text-[#7BBF7C] md:order-none md:row-span-2">
          <div>
            <h2 className="display-1">{stats.completed ?? 0}</h2>
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
          <p className="title-2">{stats.additionalFunds ?? 0}</p>
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
