import { useEffect, useState, useCallback } from 'react';
import { profilesUseCases } from '@/data/container';

export function useProfile(profileId?: string, initialFollowersCount: number | null = null) {
  const [followersCount, setFollowersCount] = useState<number | null>(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!profileId) return;
    setIsLoading(true);
    profilesUseCases
      .getById(profileId)
      .then((profile) => {
        if (!mounted) return;
        if (profile) setFollowersCount(profile.followersCount);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [profileId]);

  const onFollowChange = useCallback((wasFollowing: boolean) => {
    setFollowersCount((prev) => (prev === null ? null : Math.max(0, prev + (wasFollowing ? -1 : 1))));
    if (!profileId) return;
    profilesUseCases.toggleFollow(profileId, wasFollowing).catch(() => {});
  }, [profileId]);

  return {
    followersCount,
    isLoading,
    onFollowChange,
  };
}


