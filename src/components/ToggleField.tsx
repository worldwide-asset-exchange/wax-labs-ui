import { forwardRef, InputHTMLAttributes, Ref } from 'react'

interface ToggleFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  type: 'checkbox' | 'radio'
}

function ToggleFieldComponent({ label, type, ...props }: ToggleFieldProps, ref: Ref<HTMLInputElement>) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 rounded-md bg-ui-element py-3 pl-3 pr-6 focus-within:ring-1 focus-within:ring-accent-dark">
      <input
        {...props}
        ref={ref}
        type={type}
        className="peer m-[0.1875rem] h-[1.125rem] w-[1.125rem] border-2 border-white bg-transparent text-accent focus:outline-none focus:ring-accent-dark"
      />
      <span className="label-1 select-none text-high-contrast peer-checked:text-accent">{label}</span>
    </label>
  )
}

export const ToggleField = forwardRef(ToggleFieldComponent)
