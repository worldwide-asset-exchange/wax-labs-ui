import { MdOutlineThumbDown, MdOutlineThumbUp } from 'react-icons/md';

interface VoteBarProps {
  yes: string;
  no: string;
}

export function VoteBar({ yes, no }: VoteBarProps) {
  return (
    <div className="relative flex justify-between overflow-hidden rounded-md">
      <p className="label-1 relative z-10 flex items-center gap-2 p-2 text-[#7BBF7C]">
        <MdOutlineThumbUp size={24} /> {yes}
      </p>
      <p className="label-1 relative z-10 flex items-center gap-2 p-2 text-[#E07258]">
        {no}
        <MdOutlineThumbDown size={24} />
      </p>

      <span
        className="absolute left-0 h-full bg-[#213824]"
        style={{
          width: `${yes}`,
        }}
      />
      <span
        className="absolute right-0 h-full bg-[#4E2018]"
        style={{
          width: `${no}`,
        }}
      />
    </div>
  );
}
