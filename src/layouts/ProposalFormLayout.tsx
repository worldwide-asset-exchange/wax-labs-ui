import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineArrowBack, MdOutlineClose } from 'react-icons/md';
import { Navigate, Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import TurndownService from 'turndown';
import { useInterval, useLocalStorage, useWindowSize } from 'usehooks-ts';
import { z } from 'zod';

import { execute } from '@/api/chain/actions';
import createAddDeliverableAction from '@/api/chain/deliverables/actions/create/createAddDeliverableAction.ts';
import createRemoveDeliverableAction from '@/api/chain/deliverables/actions/create/createRemoveDeliverableAction.ts';
import { createProposal, deliverables, proposalContentData, singleProposal } from '@/api/chain/proposals';
import createEditProposalAction from '@/api/chain/proposals/actions/create/createEditProposalAction.ts';
import { Deliverables } from '@/api/models/deliverables';
import * as AlertDialog from '@/components/AlertDialog';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { ProposalFormStep1Skeleton } from '@/components/ProposalForm/ProposalFormStep1Skeleton';
import { ProposalFormTab } from '@/components/ProposalForm/ProposalFormTab';
import { ProposalStatusKey } from '@/constants';
import { useChain } from '@/hooks/useChain';
import { useConfigData } from '@/hooks/useConfigData';
import { useToast } from '@/hooks/useToast';

const PROPOSAL_DRAFT_LOCAL_STORAGE = '@WaxLabs:v1:proposal-draft';
const turndownService = new TurndownService();

interface FormattedDeliverables {
  id: number;
  description: string;
  recipient: string;
  daysToComplete: string;
  requestedUSD: string;
}

export function ProposalFormLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const params = useParams();
  const proposalId = Number(params.proposalId);
  const { isAuthenticated, session, actor } = useChain();
  const [cancelProposalModal, setCancelProposalModal] = useState(false);

  const { toast } = useToast();
  const { configs } = useConfigData();

  const ProposalSchema = useMemo(() => {
    return z.object({
      title: z.string().nonempty(t('titleErrorEmpty')!).max(64),
      description: z.string().nonempty(t('descriptionErrorEmpty')!).max(160),
      category: z
        .nullable(z.string())
        .refine(value => !!value, {
          message: t('categoryErrorEmpty')!,
        })
        .transform(value => Number(value)),
      imageURL: z.string().url(),
      content: z.string().nonempty(t('contentErrorEmpty')!).max(4096),
      financialRoadMap: z.string().nonempty(t('financialRoadMapErrorEmpty')!).max(4096),
      deliverables: z
        .object({
          id: z.optional(z.number()),
          description: z.string().nonempty(t('deliverableDescriptionErrorEmpty')!),
          recipient: z.string().nonempty(t('deliverableRecipientErrorEmpty')!),
          daysToComplete: z
            .string()
            .nonempty(t('deliverableDaysToCompleteErrorEmpty')!)
            .transform(value => Number(value)),
          requestedUSD: z.string().nonempty(t('deliverableRequestedUSDErrorEmpty')!),
        })
        .array()
        .nullish(),
    });
  }, [t]);

  type ProposalForm = z.input<typeof ProposalSchema>;

  const fieldsPerStep = useMemo(() => {
    return [
      ['title', 'description', 'category'],
      ['imageURL', 'complementaryFile', 'content'],
      ['financialRoadMap'],
      ['deliverables'],
    ] as Array<keyof ProposalForm>[];
  }, []);

  const [defaultValues, setDefaultValues] = useLocalStorage(PROPOSAL_DRAFT_LOCAL_STORAGE, {});

  const [searchParams, setSearchParams] = useSearchParams();
  const stepParam = useMemo(() => Number(searchParams.get('step')), [searchParams]);

  const currentStep = useMemo(() => stepParam || 1, [stepParam]);

  const {
    data: proposal,
    isLoading,
    isError,
  } = useQuery<ProposalForm | undefined>({
    queryKey: ['proposal', proposalId, 'edit'],
    queryFn: async () => {
      const [proposalData, contentData, deliverablesData] = await Promise.all([
        singleProposal({ proposalId }),
        proposalContentData({ proposalId }),
        deliverables({ proposalId }),
      ]);

      if (!proposalData) {
        toast({ description: 'Error: An unexpected error has occurred', variant: 'error' });
        return Promise.reject('Proposal does not exist');
      }

      if (proposalData.status !== ProposalStatusKey.DRAFTING) {
        toast({ description: 'Error: Proposal is not in drafting state', variant: 'error' });
        return Promise.reject('Proposal not in drafting state');
      }

      const formattedDeliverables = deliverablesData.deliverables.map((deliverable: Deliverables) => {
        return {
          id: deliverable.deliverable_id,
          description: deliverable.small_description,
          recipient: deliverable.recipient,
          daysToComplete: String(deliverable.days_to_complete),
          requestedUSD: deliverable.requested,
        } as FormattedDeliverables;
      });

      return {
        title: proposalData.title,
        description: proposalData.description,
        category: String(proposalData.category),
        imageURL: proposalData.image_url,
        complementaryFile: '',
        content: marked(contentData?.content ?? '', {
          gfm: true,
          breaks: true,
        }),
        financialRoadMap: marked(proposalData?.road_map ?? '', {
          gfm: true,
          breaks: true,
        }),
        deliverables: formattedDeliverables,
      } as ProposalForm;
    },
    enabled: !!proposalId && isAuthenticated === true,
  });

  const methods = useForm<ProposalForm>({
    resolver: zodResolver(ProposalSchema),
    mode: 'onTouched',
    defaultValues,
    values: proposal,
  });

  const steps = useMemo(() => {
    const fieldErrors = Object.keys(methods.formState.errors);

    const errorPerStep = fieldsPerStep.map(step => {
      return step.some(field => {
        return fieldErrors.includes(field);
      });
    });

    return [
      {
        title: t('detail'),
        step: 1,
        hasError: errorPerStep[0],
      },
      {
        title: t('content'),
        step: 2,
        hasError: errorPerStep[1],
      },
      {
        title: t('financial'),
        step: 3,
        hasError: errorPerStep[2],
      },
      {
        title: t('deliverables'),
        step: 4,
        hasError: errorPerStep[3],
      },
    ];
  }, [t, fieldsPerStep, methods.formState.errors]);

  const stepsAmount = steps.length;

  useInterval(() => {
    if (!proposalId) {
      setDefaultValues(methods.getValues());
    }
  }, 10000);

  useEffect(() => {
    function ensureValidStepQueryParam() {
      if (!stepParam || stepParam > stepsAmount || (stepParam === 4 && !proposalId)) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('step', '1');
        setSearchParams(newParams);
      }
    }

    if (isAuthenticated) {
      ensureValidStepQueryParam();
    }
  }, [stepParam, stepsAmount, searchParams, setSearchParams, proposalId, isAuthenticated]);

  const isAllCurrentStepFieldsValid = useCallback(async () => {
    const fieldsToValidate = fieldsPerStep.find((_, stepIndex) => currentStep === stepIndex + 1) ?? [];

    await methods.trigger(fieldsToValidate);

    return (
      Object.keys(methods.formState.errors).filter(fieldName =>
        fieldsToValidate.includes(fieldName as keyof ProposalForm)
      ).length === 0
    );
  }, [currentStep, fieldsPerStep, methods]);

  const onClose = useCallback(() => {
    localStorage.removeItem(PROPOSAL_DRAFT_LOCAL_STORAGE);
    navigate('/proposals');
  }, [navigate]);

  const nextStep = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('step', String(currentStep + 1));
    setSearchParams(newParams);
  }, [currentStep, searchParams, setSearchParams]);

  const handleCreateProposal = useCallback(
    async (data: ProposalForm) => {
      const content = turndownService.turndown(DOMPurify.sanitize(data.content));
      const road_map = turndownService.turndown(DOMPurify.sanitize(data.financialRoadMap));
      const category = configs?.categories[Number(data.category)] as string;

      try {
        await createProposal({
          session: session!,
          proposal: {
            title: data.title,
            category,
            description: data.description,
            image_url: data.imageURL,
            estimated_time: 1,
            content,
            road_map,
            deliverables: 0,
          },
        });

        localStorage.removeItem(PROPOSAL_DRAFT_LOCAL_STORAGE);
        toast({
          variant: 'success',
          description: t('proposalCreated'),
        });
        navigate(`/${actor}`);
      } catch (error) {
        toast({ description: t('unexpectedError'), variant: 'error' });
      }
    },
    [session, navigate, actor, configs?.categories, toast, t]
  );

  const handleUpdateProposal = useCallback(
    async (data: ProposalForm) => {
      localStorage.removeItem(PROPOSAL_DRAFT_LOCAL_STORAGE);
      const content = turndownService.turndown(DOMPurify.sanitize(data.content));
      const road_map = turndownService.turndown(DOMPurify.sanitize(data.financialRoadMap));
      const category = configs?.categories[Number(data.category)] as string;

      const actions = [];
      actions.push(
        createEditProposalAction({
          proposal: {
            proposal_id: proposalId,
            title: data.title,
            category,
            description: data.description,
            image_url: data.imageURL,
            estimated_time: 1,
            content,
            road_map,
          },
          session: session!,
        })
      );

      if (proposal?.deliverables?.length) {
        proposal.deliverables.forEach(deliverable => {
          actions.push(
            createRemoveDeliverableAction({
              deliverableId: deliverable.id!,
              proposalId,
              session: session!,
            })
          );
        });
      }

      if (data.deliverables?.length) {
        data.deliverables.forEach((deliverable, index) => {
          actions.push(
            createAddDeliverableAction({
              proposalId,
              deliverableId: index,
              recipient: deliverable.recipient,
              requestedAmount: deliverable.requestedUSD,
              smallDescription: deliverable.description,
              daysToComplete: deliverable.daysToComplete,
              session: session!,
            })
          );
        });
      }

      try {
        await execute(session!, actions);

        localStorage.removeItem(PROPOSAL_DRAFT_LOCAL_STORAGE);
        toast({
          variant: 'success',
          description: t('proposalUpdated'),
        });
        navigate(`/proposals/${proposalId}`);
      } catch (error) {
        toast({ description: t('unexpectedError'), variant: 'error' });
      }
    },
    [session, navigate, configs?.categories, toast, proposalId, proposal?.deliverables, t]
  );

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!proposalId && currentStep === 3) {
        methods.handleSubmit(handleCreateProposal)();
        return;
      }

      if (currentStep !== 4) {
        const isValid = await isAllCurrentStepFieldsValid();
        if (isValid) {
          nextStep();
        }
      } else {
        methods.handleSubmit(handleUpdateProposal)();
      }
    },
    [
      currentStep,
      handleCreateProposal,
      handleUpdateProposal,
      isAllCurrentStepFieldsValid,
      methods,
      nextStep,
      proposalId,
    ]
  );

  if (isAuthenticated === false) {
    return <Navigate to="/" />;
  }

  if (isError) {
    return <Navigate to="/" />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <header className="sticky left-0 top-0 z-30 flex w-full justify-between border-b border-subtle-light bg-app p-4 pb-[calc(1rem-1px)] max-md:pl-2">
          <div className="flex flex-1 items-center gap-4">
            {width < 1024 ? (
              <>
                {currentStep !== 1 ? (
                  <Link to={`?step=${currentStep - 1}`} variant="tertiary" square>
                    <MdOutlineArrowBack size={24} />
                  </Link>
                ) : (
                  <Button variant="tertiary" onClick={() => setCancelProposalModal(true)} square>
                    <MdOutlineClose size={24} />
                  </Button>
                )}
              </>
            ) : (
              <Button variant="tertiary" onClick={() => setCancelProposalModal(true)} square>
                <MdOutlineClose size={24} />
              </Button>
            )}
            <span className="title-3 text-high-contrast">{t('createProposal')}</span>
          </div>
          {width > 767 && (
            <div className="flex flex-1 justify-center gap-2">
              {steps.map(stepItem => {
                if (!proposalId && stepItem.step === 4) {
                  return null;
                }

                return (
                  <ProposalFormTab
                    key={stepItem.step}
                    title={stepItem.title}
                    step={stepItem.step}
                    isActive={currentStep === stepItem.step}
                    hasError={stepItem.hasError}
                  />
                );
              })}
            </div>
          )}
          <div className="flex flex-none items-center justify-end gap-4 md:flex-1">
            {currentStep !== 1 && width > 1024 && (
              <Link to={`?step=${currentStep - 1}`} variant="tertiary">
                {t('back')}
              </Link>
            )}
            <Button type="submit" variant="primary">
              {proposalId && currentStep !== 4 ? t('next') : !proposalId && currentStep < 3 ? t('next') : t('submit')}
            </Button>
          </div>
        </header>

        <AlertDialog.Root
          open={cancelProposalModal}
          onOpenChange={setCancelProposalModal}
          title={t('cancelProposalModalTitle')}
          description={t('cancelProposalModalDescription')}
        >
          <AlertDialog.Action onClick={onClose}>{t('discard')}</AlertDialog.Action>
          <AlertDialog.Cancel>{t('continueEditing')}</AlertDialog.Cancel>
        </AlertDialog.Root>

        {proposalId && isLoading ? <ProposalFormStep1Skeleton /> : <Outlet />}
      </form>
    </FormProvider>
  );
}
