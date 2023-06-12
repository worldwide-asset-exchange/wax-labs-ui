import { forwardRef, InputHTMLAttributes, ReactNode, Ref, useId } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  children?: ReactNode;
}

function InputComponent({ label, error, children, ...props }: InputProps, ref: Ref<HTMLInputElement>) {
  const id = useId();

  return (
    <div data-error={!!error} className="group/input">
      {label && (
        <label htmlFor={id} className="label-1 mb-2 block w-full text-high-contrast">
          {label}
        </label>
      )}
      <div className="flex items-center rounded-md border border-transparent bg-ui-element focus-within:ring-1 focus-within:ring-accent-dark hover:border-interactive group-data-[error=true]/input:border-[#ED6E6D]">
        {children && <div className="flex-none pl-3 text-low-contrast">{children}</div>}
        <div className="flex-1">
          <input
            {...props}
            ref={ref}
            id={id}
            type={props.type ?? 'text'}
            className="body-2 w-full border-none bg-transparent p-[calc(0.75rem-1px)] text-high-contrast placeholder:text-low-contrast focus:ring-0"
          />
        </div>
        {error && (
          <div className="flex-none pr-3 text-[#ED6E6D]">
            <MdOutlineErrorOutline size={24} />
          </div>
        )}
      </div>
      {error && <span className="body-3 mt-2 block text-[#ED6E6D]">{error}</span>}
    </div>
  );
}

export const Input = forwardRef(InputComponent);
