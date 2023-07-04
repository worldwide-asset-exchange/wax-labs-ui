import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { FormEvent, useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineArrowBack, MdOutlineClose } from 'react-icons/md';
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useInterval, useLocalStorage, useWindowSize } from 'usehooks-ts';
import { z } from 'zod';

import { deliverables, proposalContentData, singleProposal } from '@/api/chain/proposals';
import { Deliverables } from '@/api/models/deliverables';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { ProposalFormStep1Skeleton } from '@/components/ProposalForm/ProposalFormStep1Skeleton';
import { ProposalFormTab } from '@/components/ProposalForm/ProposalFormTab';

const PROPOSAL_DRAFT_LOCAL_STORAGE = '@WaxLabs:v1:proposal-draft';

export function ProposalFormLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const ProposalSchema = useMemo(() => {
    return z.object({
      title: z
        .string()
        .nonempty(t('titleErrorEmpty') as string)
        .max(64),
      description: z
        .string()
        .nonempty(t('descriptionErrorEmpty') as string)
        .max(160),
      category: z
        .string()
        .nonempty()
        .transform(value => Number(value)),
      imageURL: z.string(),
      complementaryFile: z.union([z.instanceof(FileList), z.string()]).transform(files => files[0]),
      content: z
        .string()
        .nonempty(t('contentErrorEmpty') as string)
        .max(4096),
      financialRoadMap: z
        .string()
        .nonempty(t('financialRoadMapErrorEmpty') as string)
        .max(4096),
      deliverables: z
        .object({
          description: z.string().nonempty(t('deliverableDescriptionErrorEmpty') as string),
          recipient: z.string().nonempty(t('deliverableRecipientErrorEmpty') as string),
          daysToComplete: z
            .string()
            .nonempty(t('deliverableDaysToCompleteErrorEmpty') as string)
            .transform(value => Number(value)),
          requestedUSD: z.string().nonempty(t('deliverableRequestedUSDErrorEmpty') as string),
        })
        .array()
        .min(1, t('deliverableErrorEmpty') as string),
    });
  }, [t]);

  type Proposal = z.input<typeof ProposalSchema>;

  const fieldsPerStep = useMemo(() => {
    return [
      ['title', 'description', 'category'],
      ['imageURL', 'complementaryFile', 'content'],
      ['financialRoadMap'],
      ['deliverables'],
    ] as Array<keyof Proposal>[];
  }, []);

  const [defaultValues, setDefaultValues] = useLocalStorage(PROPOSAL_DRAFT_LOCAL_STORAGE, {
    category: '0',
    deliverables: [
      {
        description: '',
        recipient: '',
        daysToComplete: '',
        requestedUSD: '',
      },
    ],
  });

  const { width } = useWindowSize();
  const { proposalId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const stepParam = useMemo(() => Number(searchParams.get('step')), [searchParams]);

  const currentStep = useMemo(() => stepParam || 1, [stepParam]);
  const steps = useMemo(() => {
    return [
      {
        title: t('detail'),
        step: 1,
      },
      {
        title: t('content'),
        step: 2,
      },
      {
        title: t('financial'),
        step: 3,
      },
      {
        title: t('deliverables'),
        step: 4,
      },
    ];
  }, [t]);

  const stepsAmount = steps.length;

  const { data: proposal, isLoading } = useQuery<Proposal>({
    queryKey: ['proposal', proposalId, 'edit'],
    queryFn: () => {
      return Promise.all([
        singleProposal({ proposalId: proposalId as string }),
        proposalContentData({ proposalId: proposalId as string }),
        deliverables({ proposalId: proposalId as string }),
      ]).then(([proposalData, contentData, deliverablesData]) => {
        if (proposalData.status !== 1) {
          // To do:
          // If the proposal is not a draft make a redirect or add a message
          // Use enum
        }

        const formattedDeliverables = deliverablesData.deliverables.map((deliverable: Deliverables) => {
          return {
            description: deliverable.small_description,
            recipient: deliverable.recipient,
            daysToComplete: String(deliverable.days_to_complete),
            requestedUSD: deliverable.requested,
          };
        });

        return {
          title: proposalData.title,
          description: proposalData.description,
          category: String(proposalData.category),
          imageURL: proposalData.image_url,
          complementaryFile: '',
          content: contentData?.content ?? '',
          financialRoadMap: proposalData.road_map,
          deliverables: formattedDeliverables,
        };
      });
    },
    enabled: !!proposalId,
  });

  const methods = useForm<Proposal>({
    resolver: zodResolver(ProposalSchema),
    defaultValues,
    values: proposal,
  });

  useInterval(() => {
    if (!proposalId) {
      setDefaultValues(methods.getValues());
    }
  }, 10000);

  useEffect(() => {
    if (!stepParam || stepParam > stepsAmount) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('step', '1');
      setSearchParams(newParams);
    }
  }, [stepParam, stepsAmount, searchParams, setSearchParams]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (currentStep !== 4) {
      nextStep();
    } else {
      methods.handleSubmit(submit)();
    }
  }

  const onClose = useCallback(() => {
    localStorage.removeItem(PROPOSAL_DRAFT_LOCAL_STORAGE);
    navigate('/proposals');
  }, [navigate]);

  function nextStep() {
    const fieldsToValidate = fieldsPerStep.find((_, stepIndex) => currentStep === stepIndex + 1) ?? [];

    methods.trigger(fieldsToValidate).then(() => {
      const isValid =
        Object.keys(methods.formState.errors).filter(fieldName =>
          fieldsToValidate.includes(fieldName as keyof Proposal)
        ).length === 0;

      if (isValid) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('step', String(currentStep + 1));
        setSearchParams(newParams);
      }
    });
  }

  async function submit(data: Proposal) {
    localStorage.removeItem(PROPOSAL_DRAFT_LOCAL_STORAGE);
    console.debug(data);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <header className="sticky left-0 top-0 flex w-full justify-between border-b border-subtle-light bg-app p-4 pb-[calc(1rem-1px)] max-md:pl-2">
          <div className="flex flex-1 items-center gap-4">
            {width < 1024 ? (
              <>
                {currentStep !== 1 ? (
                  <Link to={`?step=${currentStep - 1}`} variant="tertiary" square>
                    <MdOutlineArrowBack size={24} />
                  </Link>
                ) : (
                  <Button variant="tertiary" onClick={onClose} square>
                    <MdOutlineClose size={24} />
                  </Button>
                )}
              </>
            ) : (
              <Button variant="tertiary" onClick={onClose} square>
                <MdOutlineClose size={24} />
              </Button>
            )}
            <span className="title-3 text-high-contrast">{t('createProposal')}</span>
          </div>
          {width > 767 && (
            <div className="flex flex-1 justify-center gap-2">
              {steps.map(stepItem => (
                <ProposalFormTab
                  key={stepItem.step}
                  title={stepItem.title}
                  step={stepItem.step}
                  isActive={currentStep === stepItem.step}
                />
              ))}
            </div>
          )}
          <div className="flex flex-none items-center justify-end gap-4 md:flex-1">
            {currentStep !== 1 && width > 1024 && (
              <Link to={`?step=${currentStep - 1}`} variant="tertiary">
                {t('back')}
              </Link>
            )}
            <Button type="submit" variant="primary">
              {currentStep !== 4 ? t('next') : t('submit')}
            </Button>
          </div>
        </header>
        {proposalId && isLoading ? <ProposalFormStep1Skeleton /> : <Outlet />}
      </form>
    </FormProvider>
  );
}
