import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Logo from '@/assets/logo.svg';
import * as Nav from '@/components/Nav';
import { Notification } from '@/components/Notifications';
import { useChain } from '@/hooks/useChain.ts';
import { useConfigData } from '@/hooks/useConfigData.ts';

export function AppBar() {
  const { t } = useTranslation();
  const { login, isAuthenticated, actor } = useChain();
  const { isAdmin } = useConfigData();

  const authenticatedChild = (
    <>
      {isAdmin && (
        <Nav.Item>
          <Nav.Link to="/settings">{t('settings')}</Nav.Link>
        </Nav.Item>
      )}
      <Nav.Item>
        <Nav.Link to={'/' + actor}>{actor}</Nav.Link>
      </Nav.Item>
    </>
  );

  return (
    <header className="sticky left-0 top-0 z-30 flex items-center justify-between border-b border-subtle-light bg-app p-4 pb-[calc(1rem-1px)]">
      <Link to="/" className="rounded-md p-2">
        <img src={Logo} alt="" />
      </Link>
      <Nav.Root>
        <Nav.List>
          <Nav.Item>
            <Nav.Link to="/">{t('home')}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link to="/proposals" end>
              {t('proposals')}
            </Nav.Link>
          </Nav.Item>
          {isAuthenticated ? (
            authenticatedChild
          ) : (
            <Nav.Item>
              <Nav.Button onClick={login}>{t('signIn')}</Nav.Button>
            </Nav.Item>
          )}
        </Nav.List>
        {isAuthenticated && <Notification />}
      </Nav.Root>
    </header>
  );
}
