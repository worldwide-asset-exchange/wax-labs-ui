import { FaDiscord, FaTelegramPlane, FaTwitter } from 'react-icons/fa'

import dlt from '@/assets/dlt.svg'
import wax from '@/assets/wax.svg'
import { Button } from '@/components/Button'

export function Footer() {
  return (
    <footer className="bg-app pt-8">
      <div className="mx-auto max-w-7xl border-t border-subtle-light px-4 py-16">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <div className="flex flex-1 items-center gap-8">
            <img src={wax} alt="" />
            <div className="flex flex-none items-center gap-2">
              <a
                href="https://twitter.com/WAX_io"
                target="_blank"
                className="rounded-md p-3 text-high-contrast duration-150 hover:bg-subtle"
                rel="noreferrer"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://go.wax.io/Discord"
                target="_blank"
                className="rounded-md p-3 text-high-contrast duration-150 hover:bg-subtle"
                rel="noreferrer"
              >
                <FaDiscord size={24} />
              </a>
              <a
                href="https://t.me/wax_io"
                target="_blank"
                className="rounded-md p-3 text-high-contrast duration-150 hover:bg-subtle"
                rel="noreferrer"
              >
                <FaTelegramPlane size={24} />
              </a>
            </div>
          </div>
          <div className="flex flex-none items-center gap-2">
            <Button to="/" variant="link" square>
              Terms of Service
            </Button>
            <Button to="/" variant="link" square>
              Privacy Policy
            </Button>
          </div>
        </div>
        <p className="body-2 pb-16 pt-8 text-center text-high-contrast md:text-left">
          Copyright © 2023 WAX, Worldwide Asset eXchange™ All rights reserved.
        </p>
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
