import LoaderSpinner from '@/components/LoaderSpinner';
import { useGetIsFollowingQuery, useSetIsFollowingMutation } from '@/store/usersReducer';
import { useSession } from 'next-auth/react';

export default function FollowButton({ artistAddress }) {
  const { data: sessionData } = useSession();
  const { data: following, isFetching: isFetchingFollowing } = useGetIsFollowingQuery(undefined, {
    skip: !sessionData,
  });
  const [setIsFollowing, { isLoading: isSettingFollowing }] = useSetIsFollowingMutation();
  const isOwner = () => sessionData?.address == artistAddress;

  if (!sessionData || isOwner()) {
    return null;
  }

  function isFollowing(): boolean {
    return following?.includes(artistAddress)!;
  }

  function handleButtonClick() {
    setIsFollowing({ address: artistAddress, isFollowing: !isFollowing() });
  }

  const loading = isFetchingFollowing || isSettingFollowing;

  return (
    <button onClick={handleButtonClick} disabled={loading} className='artist-page__connect'>
      {loading ? <LoaderSpinner /> : isFollowing() ? 'unfollow' : 'follow'}
    </button>
  );
}
