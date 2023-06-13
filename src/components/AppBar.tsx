import { MdOutlineNotifications } from 'react-icons/md';

import Logo from '@/assets/logo.svg';
import { Link } from '@/components/Link.tsx';
import { Nav } from '@/components/Nav';

export function AppBar() {
  const isAuthenticated = true;

  return (
    <header className="sticky left-0 top-0 z-30 flex items-center justify-between border-b border-subtle-light bg-app p-4 pb-[calc(1rem-1px)]">
      <Link to="/">
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
              {/* <Nav.Item>
                <Nav.Link to="/settings">hyogasereiou</Nav.Link>
              </Nav.Item> */}
            </>
          ) : (
            <Nav.Item>
              <Nav.Button
                onClick={() => {
                  console.debug('sign in');
                }}
              >
                Sign in
              </Nav.Button>
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
