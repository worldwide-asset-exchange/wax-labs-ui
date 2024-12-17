import { useTranslation } from 'react-i18next';
import { FaDiscord, FaRobot, FaTelegramPlane, FaTwitter } from 'react-icons/fa';

import dlt from '@/assets/dlt.svg';
import wax from '@/assets/wax.svg';
import { Link } from '@/components/Link';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-app pt-8">
      <div className="mx-auto max-w-7xl border-t border-subtle-light px-4 py-16">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <div className="flex flex-1 items-center gap-8">
            <img src={wax} alt="WaxLabs" />
            <div className="flex flex-none items-center gap-2">
              <Link target="_blank" to="https://twitter.com/WAX_io" square title="WaxLabs Twittter">
                <FaTwitter size={24} />
              </Link>
              <Link target="_blank" to="https://go.wax.io/Discord" square title="WaxLabs Discord">
                <FaDiscord size={24} />
              </Link>
              <Link target="_blank" to="https://t.me/wax_io" square title="WaxLabs Telegram">
                <FaTelegramPlane size={24} />
              </Link>
              <Link target="_blank" to="https://t.me/waxlabsbot" square title="WaxLabs Telegram Bot">
                <FaRobot size={24} />
              </Link>
            </div>
          </div>
          <div className="flex flex-none items-center gap-2">
            <Link target="_blank" to="https://www.wax.io/terms-of-service" variant="link" square>
              {t('termsOfService')}
            </Link>
            <Link target="_blank" to="https://www.wax.io/privacy-policy" variant="link" square>
              {t('privacyPolicy')}
            </Link>
          </div>
        </div>
        <p className="body-2 pb-16 pt-8 text-center text-high-contrast md:text-left">{t('copyright')}</p>
        <a
          href="https://detroitledger.tech/"
          target="_blank"
          className="opacity-80 duration-150 hover:opacity-100"
          rel="noreferrer"
        >
          <img src={dlt} alt="" className="mx-auto" />
        </a>
      </div>
    </footer>
  );
}
