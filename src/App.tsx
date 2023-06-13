import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { route } from '@/route';

export function App() {
  return <RouterProvider router={route} />;
}

export default function WrappedApp() {
  return (
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  );
}
