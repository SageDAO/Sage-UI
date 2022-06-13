import React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Loader from 'react-loader-spinner';
import { useAccount, useBalance } from 'wagmi';
import { toast } from 'react-toastify';
import { useGetUserQuery } from '@/store/services/user';
import shortenAddress from '@/utilities/shortenAddress';
import EditProfileModal from '@/components/Modals/EditProfileModal';
import ProfilePictureModal from '@/components/Modals/ProfilePictureModal';
import { DEFAULT_PROFILE_PICTURE, parameters } from '@/constants/config';
import useModal from '@/hooks/useModal';
import { MyCollection } from '@/components/MyCollection';

function profile() {
  const { data: sessionData } = useSession();
  const { data: userData, isFetching: isFetchingUser } = useGetUserQuery();
  const { data: accountData } = useAccount();
  const { ASHTOKEN_ADDRESS } = parameters;
  const { data: userBalance } = useBalance({
    addressOrName: accountData?.address,
    token: ASHTOKEN_ADDRESS,
  });
  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    openModal: openEditModal,
  } = useModal();
  const {
    isOpen: isProfilePicModalOpen,
    closeModal: closeProfilePicModal,
    openModal: openProfilePicModal,
  } = useModal();
  if (!sessionData) {
    return <div className='profile-page'>sign in to view profile</div>;
  }
  if (!userData && isFetchingUser) {
    return (
      <div className='profile-page'>
        <br />
        <Loader type='ThreeDots' color='white' height={10} width={50} timeout={0} />
      </div>
    );
  }

  return (
    <div className='profile-page'>
      <EditProfileModal isOpen={isEditModalOpen} closeModal={closeEditModal} title='Edit Profile' />
      <ProfilePictureModal
        isOpen={isProfilePicModalOpen}
        closeModal={closeProfilePicModal}
        title='Profile Picture'
      />
      <div className='account-card'>
        <div className='account-card__content'>
          <div className='account-card__edit-container'>
            <button className='account-card__edit-btn' onClick={openEditModal}>
              edit profile
            </button>
          </div>
          <div className='account-card__pfp'>
            <Image
              src={userData?.profilePicture || DEFAULT_PROFILE_PICTURE}
              layout='fill'
              objectFit='cover'
              onClick={openProfilePicModal}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className='account-card__name'>{userData?.displayName || 'name'}</div>
          <div className='account-card__handle'>{userData?.username || '@handle'}</div>
          <div className='account-card__bio'>{userData?.bio}</div>
          <div className='account-card__socials'>
            <div className='account-card__socials-icon'></div>
          </div>
        </div>
        <div className='account-card__private'>
          <h1 className='account-card__private-header'>private</h1>
          <div className='account-card__private-info'>
            <div
              className='account-card__private-info-address'
              onClick={() => {
                window.navigator.clipboard.writeText(sessionData?.address as string);
                toast.success('Address copied to clipboard');
              }}
            >
              {shortenAddress(userData?.walletAddress as string)}
            </div>
            <div className='account-card__private-info-pina'>
              {(userBalance && userBalance.formatted + ' ' + userBalance.symbol) || '0'}
            </div>
          </div>
          <h1 className='account-card__private-email'>{userData?.email}</h1>
        </div>
      </div>
      <MyCollection />
    </div>
  );
}

export default profile;
