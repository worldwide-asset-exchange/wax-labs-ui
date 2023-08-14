import * as Collapsible from '@radix-ui/react-collapsible';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  MdCalendarToday,
  MdOutlineAttachMoney,
  MdOutlineCheck,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdOutlinePerson,
  MdOutlineWhatshot,
} from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { deliverables as getDeliverables } from '@/api/chain/proposals';
import * as Info from '@/components/Info';
import { StatusTag } from '@/components/StatusTag';
import { toProposalStatus } from '@/utils/proposalUtils.ts';

interface ProposalDetailDeliverablesProps {
  total: number;
  completed: number;
}

export function ProposalDetailDeliverables({ total, completed }: ProposalDetailDeliverablesProps) {
  const { t } = useTranslation();

  const params = useParams();
  const proposalId = Number(params.proposalId);

  const { data: deliverables, isLoading: isLoadingDeliverables } = useQuery({
    queryKey: ['proposal', proposalId, 'deliverables'],
    queryFn: () => getDeliverables({ proposalId }).then(response => response.deliverables),
    enabled: !!proposalId,
  });

  function formatLastReviewed(lastReviewed: string) {
    if (lastReviewed) {
      return format(new Date(lastReviewed), 'LLL Mo, uuuu');
    }
    return '-';
  }

  return (
    <>
      <h2 className="title-2 mx-auto mt-8 max-w-5xl px-4 py-8 text-high-contrast">
        {t('deliverables')}{' '}
        <span className="label-1">
          {completed}/{total} {t('deliverablesCompleted')}
        </span>
      </h2>
      <div className="mx-auto max-w-5xl space-y-1 px-1 pb-8 md:space-y-4 md:px-4">
        {isLoadingDeliverables ? (
          <>
            {[1, 2, 3].map(item => (
              <div key={item} className="flex animate-pulse items-center gap-4 rounded-xl bg-subtle p-8 duration-150">
                <div className="h-14 w-14 flex-none rounded-full bg-ui-element" />
                <div className="mt-1 h-5 w-2/3 flex-none rounded-md bg-ui-element" />
              </div>
            ))}
          </>
        ) : deliverables ? (
          <>
            {deliverables.map((deliverable, index) => (
              <Collapsible.Root asChild key={deliverable.deliverable_id}>
                <article className="group/deliverable rounded-xl bg-subtle focus-within:ring-1 focus-within:ring-accent-dark">
                  <Collapsible.Trigger className="group/deliverable-header flex w-full cursor-pointer items-center gap-4 p-8 focus:ring-0">
                    <div className="title-3 h-14 w-14 flex-none rounded-full border border-high-contrast text-center leading-[3.5rem] text-high-contrast group-hover/deliverable-header:border-accent-dark group-hover/deliverable-header:text-accent-dark">
                      {index + 1}
                    </div>
                    <div className="flex flex-1 flex-wrap text-left md:items-center max-md:flex-col max-md:gap-1">
                      <div className="flex-1">
                        <h3 className="title-3 text-high-contrast group-hover/deliverable-header:text-accent-dark">
                          {deliverable.small_description}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-8 group-data-[state=open]/deliverable:hidden max-md:hidden">
                          <div className="flex flex-none flex-nowrap gap-2">
                            <MdOutlineAttachMoney size={24} className="text-low-contrast" />
                            <p className="label-1 text-high-contrast">{deliverable.requested}</p>
                          </div>
                          <div className="flex flex-none flex-nowrap gap-2">
                            <MdOutlineWhatshot size={24} className="text-low-contrast" />
                            <p className="label-1 text-high-contrast">{deliverable.claimable_wax}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-none">
                        <StatusTag status={toProposalStatus(deliverable.status)} />
                      </div>
                    </div>
                    <div className="flex-none text-low-contrast group-hover/deliverable-header:text-accent-dark group-data-[state=open]/deliverable-header:hidden">
                      <MdOutlineKeyboardArrowDown size={24} />
                    </div>
                    <div className="flex-none text-low-contrast group-hover/deliverable-header:text-accent-dark group-data-[state=closed]/deliverable-header:hidden">
                      <MdOutlineKeyboardArrowUp size={24} />
                    </div>
                  </Collapsible.Trigger>
                  <Collapsible.Content asChild>
                    <Info.Root className="px-8 pb-8">
                      <Info.Item
                        label={t('recipient')}
                        value={deliverable.recipient}
                        className="border-t border-subtle-light"
                      >
                        <MdOutlinePerson size={24} />
                      </Info.Item>
                      <Info.Item label={t('amountRequested')} value={deliverable.requested}>
                        <MdOutlineAttachMoney size={24} />
                      </Info.Item>
                      <Info.Item label={t('toBeClaimed')} value={deliverable.claimable_wax}>
                        <MdOutlineWhatshot size={24} />
                      </Info.Item>
                      <Info.Item
                        label={t('lastReviewed')}
                        value={formatLastReviewed(deliverable.review_time ? deliverable.review_time.toString() : '')}
                      >
                        <MdCalendarToday size={24} />
                      </Info.Item>
                      <Info.Item label={t('daysToComplete')} value={String(deliverable.days_to_complete)}>
                        <MdOutlineCheck size={24} />
                      </Info.Item>
                    </Info.Root>
                  </Collapsible.Content>
                </article>
              </Collapsible.Root>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
}
