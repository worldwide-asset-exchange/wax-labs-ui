import { forwardRef, InputHTMLAttributes, Ref, useId } from 'react';
import { MdOutlineErrorOutline } from 'react-icons/md';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  hint?: string;
}

function InputFileComponent({ label, error, hint, ...props }: InputProps, ref: Ref<HTMLInputElement>) {
  const id = useId();

  return (
    <div data-error={!!error} className="group/input">
      {label && (
        <label htmlFor={id} className="label-1 mb-2 block w-full text-high-contrast">
          {label}
        </label>
      )}
      {hint && <span className="body-3 -mt-1 mb-3 block text-low-contrast">{hint}</span>}
      <div className="flex items-center rounded-md border border-transparent bg-ui-element focus-within:ring-1 focus-within:ring-accent-dark hover:border-interactive group-data-[error=true]/input:border-[#ED6E6D]">
        <div className="flex-1">
          <input
            {...props}
            ref={ref}
            type="file"
            id={id}
            className="body-2 w-full p-3 text-low-contrast file:label-1 file:mr-4 file:cursor-pointer file:rounded-md file:border file:border-accent file:bg-transparent file:px-[calc(1.5rem-1px)] file:py-[calc(0.75rem-1px)] file:text-accent focus:outline-none focus:ring-0"
          />
          <img src="" alt="" />
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

export const InputFile = forwardRef(InputFileComponent);
