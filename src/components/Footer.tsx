import { FaDiscord, FaTelegramPlane, FaTwitter } from 'react-icons/fa'

import dlt from '@/assets/dlt.svg'
import wax from '@/assets/wax.svg'
import { Link } from '@/components/Link'
import strings from '@/resources/strings'

export function Footer() {
  return (
    <footer className="bg-app pt-8">
      <div className="mx-auto max-w-7xl border-t border-subtle-light px-4 py-16">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <div className="flex flex-1 items-center gap-8">
            <img src={wax} alt="" />
            <div className="flex flex-none items-center gap-2">
              <Link href="https://twitter.com/WAX_io" square>
                <FaTwitter size={24} />
              </Link>
              <Link href="https://go.wax.io/Discord" square>
                <FaDiscord size={24} />
              </Link>
              <Link href="https://t.me/wax_io" square>
                <FaTelegramPlane size={24} />
              </Link>
            </div>
          </div>
          <div className="flex flex-none items-center gap-2">
            <Link to="/" variant="link" square>
              {strings.termsOfService}
            </Link>
            <Link to="/" variant="link" square>
              {strings.privacyPolicy}
            </Link>
          </div>
        </div>
        <p className="body-2 pb-16 pt-8 text-center text-high-contrast md:text-left">{strings.copyright}</p>
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
  )
}
