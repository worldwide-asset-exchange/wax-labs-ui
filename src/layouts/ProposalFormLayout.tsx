import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { FormEvent, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineArrowBack, MdOutlineClose } from 'react-icons/md';
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useInterval, useLocalStorage, useWindowSize } from 'usehooks-ts';
import { z } from 'zod';

import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { ProposalFormStep1Skeleton } from '@/components/ProposalForm/ProposalFormStep1Skeleton';
import { ProposalFormTab } from '@/components/ProposalForm/ProposalFormTab';

const ProposalSchema = z.object({
  title: z.string().nonempty().max(64),
  shortDescription: z.string().nonempty().max(160),
  category: z
    .string()
    .nonempty()
    .transform(value => Number(value)),
  contact: z.string().nonempty().max(64),
  coverImage: z
    .union([z.instanceof(FileList), z.string()])
    .refine(
      files => {
        if (files instanceof FileList) {
          const [file] = files;
          const imageTypes = ['image/gif', 'image/png', 'image/jpeg'];

          if (file && !imageTypes.includes(file?.type)) {
            return false;
          }
        }

        return true;
      },
      {
        message: 'Arquivo invalido',
      }
    )
    .transform(files => files[0]),
  complementaryFile: z.union([z.instanceof(FileList), z.string()]).transform(files => files[0]),
  content: z.string().nonempty().max(4096),
  financialRoadMap: z.string().nonempty().max(4096),
  deliverables: z.array(
    z.object({
      description: z.string().nonempty(),
      recipient: z.string().nonempty(),
      daysToComplete: z
        .string()
        .nonempty()
        .transform(value => Number(value)),
      requestedUSD: z.string().nonempty(),
    })
  ),
});

export type Proposal = z.input<typeof ProposalSchema>;

const fieldsPerStep = [
  ['title', 'shortDescription', 'category', 'contact'],
  ['coverImage', 'complementaryFile', 'content'],
  ['financialRoadMap'],
  ['deliverables'],
] as Array<keyof Proposal>[];

const PROPOSAL_DRAFT_LOCAL_STORAGE = '@WaxLabs:v1:proposal-draft';

export function ProposalFormLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
  const stepParam = Number(searchParams.get('step'));

  const currentStep = stepParam || 1;
  const steps = [
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
  const stepsAmount = steps.length;

  const { data: proposal, isLoading } = useQuery<Proposal>({
    queryKey: ['proposal', proposalId],
    queryFn: () => {
      return {
        title: 'WAX Labs 3.0',
        shortDescription:
          'Streamlining the proposal submission process, improving reviewer/submitter communications, and refreshing the brand to be in line with other WAX properties.',
        category: '3',
        contact: '',
        coverImage: '',
        complementaryFile: '',
        content: '',
        financialRoadMap: '',
        deliverables: [],
      };
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

  function onClose() {
    localStorage.removeItem(PROPOSAL_DRAFT_LOCAL_STORAGE);
    navigate('/proposals');
  }

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
