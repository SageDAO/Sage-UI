import useSageRoutes from '@/hooks/useSageRoutes';
import { useGetUserQuery } from '@/store/usersReducer';
import React from 'react';
import { PfpImage } from './Media/BaseMedia';

function ProfileDisplay() {
  const { data: userData } = useGetUserQuery();
  const { pushToProfile } = useSageRoutes();
  return (
    <div className='profile-page__pfp-section'>
      <div className='profile-page__pfp-container' onClick={pushToProfile}>
        <PfpImage src={userData?.profilePicture}></PfpImage>
      </div>
      <div className='profile-page__pfp-section-right'>
        <p className='profile-page__pfp-section-username'>{userData?.username || 'anonymous'}</p>
        <p className='profile-page__pfp-section-role'>{userData?.role}</p>
      </div>
    </div>
  );
}

export default ProfileDisplay;
