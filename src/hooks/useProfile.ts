import { useQuery } from '@tanstack/react-query';

import { accountProfile } from '@/api/chain/profile';
import { Profile } from '@/api/models/profile.ts';
import { imageExists } from '@/utils/image';

interface UseProfileProps {
  actor: string;
}

export function useProfile({ actor }: UseProfileProps) {
  const { data, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', actor],
    queryFn: async () => {
      const profile = await accountProfile(actor);

      if (profile) {
        try {
          await imageExists(profile?.image_url);
        } catch {
          profile.image_url = '';
        }
      }

      return profile;
    },
    enabled: !!actor,
  });

  return {
    profile: data as Profile,
    isLoadingProfile,
  };
}
