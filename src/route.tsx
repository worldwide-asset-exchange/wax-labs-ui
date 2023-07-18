import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { Home } from '@/contents/Home';
import { Balance } from '@/contents/profile/Balance';
import { CreateEditProfile } from '@/contents/profile/CreateEditProfile';
import { MyProposals } from '@/contents/profile/MyProposals';
import { UserProfile } from '@/contents/profile/UserProfile';
import { ProposalForm } from '@/contents/ProposalForm';
import { Proposals } from '@/contents/Proposals';
import { AdminRole } from '@/contents/settings/AdminRole';
import { Categories } from '@/contents/settings/Categories';
import { RemoveProfile } from '@/contents/settings/RemoveProfile';
import { USDRequested } from '@/contents/settings/USDRequested';
import { VotingPeriod } from '@/contents/settings/VotingPeriod';
import { AppLayout } from '@/layouts/AppLayout';
import { ProfileLayout } from '@/layouts/ProfileLayout';
import { ProposalFormLayout } from '@/layouts/ProposalFormLayout';
import { SettingsLayout } from '@/layouts/SettingsLayout';

export const route = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AppLayout />}>
        <Route path="" element={<Home />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="settings" element={<SettingsLayout />}>
          <Route path="" element={<Categories />} />
          <Route path="voting-period" element={<VotingPeriod />} />
          <Route path="remove-profile" element={<RemoveProfile />} />
          <Route path="admin-role" element={<AdminRole />} />
          <Route path="usd-requested" element={<USDRequested />} />
        </Route>
        <Route path=":actor" element={<ProfileLayout />}>
          <Route path="" element={<MyProposals />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="create" element={<CreateEditProfile create />} />
          <Route path="edit" element={<CreateEditProfile create={false} />} />
          <Route path="balance" element={<Balance />} />
        </Route>
      </Route>
      <Route path="/proposals" element={<ProposalFormLayout />}>
        <Route path="create" element={<ProposalForm />} />
        <Route path=":proposalId/edit" element={<ProposalForm />} />
      </Route>
    </>
  )
);
