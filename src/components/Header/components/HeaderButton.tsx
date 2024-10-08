import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface HeaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function HeaderButtonComponent({ children, ...props }: HeaderButtonProps, ref: Ref<HTMLButtonElement>) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className="-ml-2 flex flex-nowrap items-center gap-2 whitespace-nowrap rounded-md px-2 py-1 duration-150 hover:bg-subtle"
    >
      <h1 className="title-2 text-high-contrast">{children}</h1>
      <MdKeyboardArrowDown size={24} className="text-accent" />
    </button>
  );
}

export const HeaderButton = forwardRef(HeaderButtonComponent);
