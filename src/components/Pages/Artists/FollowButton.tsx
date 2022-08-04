import LoaderSpinner from '@/components/LoaderSpinner';
import { useFollowMutation, useGetFollowingQuery, useUnfollowMutation } from '@/store/usersReducer';
import { useSession } from 'next-auth/react';

export default function FollowButton({ artistAddress }) {
  const { data: sessionData } = useSession();
  const { data: following, isFetching: isFetchingFollowing } = useGetFollowingQuery(undefined, {
    skip: !sessionData,
  });
  const [follow, {isLoading: isRunningFollow}] = useFollowMutation();
  const [unfollow, {isLoading: isRunningUnfollow}] = useUnfollowMutation();

  if (!sessionData) {
    return null;
  }

  function isFollowing(): boolean {
    return following?.includes(artistAddress)!;
  }

  function handleButtonClick() {
    if (isFollowing()) {
      unfollow(artistAddress);
    } else {
      follow(artistAddress);
    }
  }

  const loading = isFetchingFollowing || isRunningFollow || isRunningUnfollow;

  return (
    <button onClick={handleButtonClick} disabled={loading} className='artist-page__connect'>
      {loading ? <LoaderSpinner /> : isFollowing() ? 'unfollow' : 'follow'}
    </button>
  );
}
