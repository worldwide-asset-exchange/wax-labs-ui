import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTelegramPlane } from 'react-icons/fa';
import { MdLink, MdOutlineGroups, MdOutlineLanguage, MdPerson } from 'react-icons/md';

import * as Info from '@/components/Info';

interface ProfileCardProps {
  imageUrl: string;
  fullName: string;
  actor: string;
  biography: string;
  groupName: string;
  country: string;
  website: string;
  telegram: string;
  children: ReactNode;
}

export function ProfileCard({
  imageUrl,
  fullName,
  actor,
  biography,
  groupName,
  country,
  website,
  telegram,
  children,
}: ProfileCardProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-8 rounded-xl bg-subtle p-8">
      <header className="flex flex-wrap items-center gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="flex h-14 min-h-[56px] w-14 min-w-[56px] flex-none items-center justify-center rounded-full border-2">
            {imageUrl ? (
              <img className="h-full w-full rounded-full object-cover" src={imageUrl} alt="" />
            ) : (
              <MdPerson className="text-low-contrast" size={28} />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="title-3 truncate text-high-contrast">{fullName}</h3>
            <p className="body-2 text-low-contrast">{actor}</p>
          </div>
        </div>
        {children && <div className="flex-none">{children}</div>}
      </header>
      <div className="space-y-1">
        <h3 className="label-2 text-high-contrast">{t('biography')}</h3>
        <p className="body-1 text-low-contrast">{biography}</p>
      </div>
      <Info.Root>
        <Info.Item label={t('groupName')} value={groupName} className="border-t border-subtle-light">
          <MdOutlineGroups size={24} />
        </Info.Item>
        <Info.Item label={t('country')} value={country}>
          <MdOutlineLanguage size={24} />
        </Info.Item>
        <Info.Item label={t('website')} value={website}>
          <MdLink size={24} />
        </Info.Item>
        <Info.Item label={t('telegram')} value={telegram}>
          <FaTelegramPlane size={24} />
        </Info.Item>
      </Info.Root>
    </section>
  );
}
