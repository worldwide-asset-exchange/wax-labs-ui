import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { Home } from '@/contents/Home';
import { Proposals } from '@/contents/Proposals';
import { Categories } from '@/contents/settings/Categories';
import { AppLayout } from '@/layouts/AppLayout';
import { SettingsLayout } from '@/layouts/SettingsLayout';

export const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route path="" element={<Home />} />
      <Route path="proposals" element={<Proposals />} />
      <Route path="settings" element={<SettingsLayout />}>
        <Route path="" element={<Categories />} />
      </Route>
    </Route>
  )
);