import { forwardRef, Ref, TextareaHTMLAttributes, useId } from 'react'
import { MdOutlineErrorOutline } from 'react-icons/md'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string | boolean
}

function TextAreaComponent({ label, error, ...props }: TextAreaProps, ref: Ref<HTMLTextAreaElement>) {
  const id = useId()

  return (
    <div data-error={!!error} className="group/input">
      {label && (
        <label htmlFor={id} className="label-1 mb-2 block w-full text-high-contrast">
          {label}
        </label>
      )}
      <div className="flex rounded-md border border-transparent bg-ui-element focus-within:ring-1 focus-within:ring-accent-dark hover:border-interactive group-data-[error=true]/input:border-[#ED6E6D]">
        <div className="flex-1">
          <textarea
            {...props}
            ref={ref}
            id={id}
            className="body-2 w-full border-none bg-transparent p-[calc(0.75rem-1px)] text-high-contrast placeholder:text-low-contrast focus:ring-0"
          />
        </div>
        {error && (
          <div className="flex-none pr-3 pt-[calc(0.75rem-1px)] text-[#ED6E6D]">
            <MdOutlineErrorOutline size={24} />
          </div>
        )}
      </div>
      {error && <span className="body-3 mt-2 block text-[#ED6E6D]">{error}</span>}
    </div>
  )
}

export const TextArea = forwardRef(TextAreaComponent)
