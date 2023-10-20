import { Link } from 'react-router-dom';

interface ProposalFormTabProps {
  title: string;
  step: number;
  isActive: boolean;
  hasError: boolean;
}

export function ProposalFormTab({ title, step, isActive, hasError }: ProposalFormTabProps) {
  return (
    <Link
      to={`?step=${step}`}
      aria-current={isActive}
      data-error={hasError}
      className="group/tab -mb-4 mt-[-0.9375rem] flex items-center gap-2 border-b p-3 aria-[current=false]:border-transparent aria-[current=true]:border-high-contrast aria-[current=false]:text-low-contrast aria-[current=true]:text-high-contrast data-[error=true]:text-[#ED6E6D] data-[error=true]:aria-[current=true]:border-[#ED6E6D]"
    >
      <span className="label-2 flex h-6 w-6 items-center justify-center rounded-full border-2 leading-6 group-aria-[current=false]/tab:border-low-contrast group-aria-[current=true]/tab:border-high-contrast group-data-[error=true]/tab:border-[#ED6E6D]">
        {step}
      </span>
      <span className="label-1 max-lg:hidden">{title}</span>
    </Link>
  );
}
