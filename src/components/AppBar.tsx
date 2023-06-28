import { MdOutlineNotifications } from 'react-icons/md';
import { Link } from 'react-router-dom';

import Logo from '@/assets/logo.svg';
import { Nav } from '@/components/Nav';
import { useChain } from '@/hooks/useChain.ts';

export function AppBar() {
  const { login, logout, isAuthenticated, actor } = useChain();

  return (
    <header className="sticky left-0 top-0 z-30 flex items-center justify-between border-b border-subtle-light bg-app p-4 pb-[calc(1rem-1px)]">
      <Link to="/" className="rounded-md p-2">
        <img src={Logo} alt="" />
      </Link>
      <Nav.Root>
        <Nav.List>
          <Nav.Item>
            <Nav.Link to="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link to="/proposals">Proposals</Nav.Link>
          </Nav.Item>
          {isAuthenticated ? (
            <>
              <Nav.Item>
                <Nav.Link to="/settings">Settings</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link to="/settings">{actor}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Button onClick={logout}>Log out</Nav.Button>
              </Nav.Item>
            </>
          ) : (
            <Nav.Item>
              <Nav.Button onClick={login}>Sign in</Nav.Button>
            </Nav.Item>
          )}
        </Nav.List>
        {isAuthenticated && (
          <Nav.Button
            onClick={() => {
              console.debug('notification');
            }}
          >
            <MdOutlineNotifications size={24} />
          </Nav.Button>
        )}
      </Nav.Root>
    </header>
  );
}
