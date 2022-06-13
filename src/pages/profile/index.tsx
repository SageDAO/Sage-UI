import React, { useState } from 'react';
import Image from 'next/image';
import Loader from 'react-loader-spinner';
import { useGetUserQuery } from '@/store/services/user';
import {
  useGetClaimedPrizesByUserQuery,
  useGetUnclaimedPrizesByUserQuery,
} from '@/store/services/prizesReducer';
import { useSession } from 'next-auth/react';
import shortenAddress from '@/utilities/shortenAddress';
import EditProfileModal from '@/components/Modals/EditProfileModal';
import { toast } from 'react-toastify';
import { GamePrize } from '@/prisma/types';
import ProfilePictureModal from '@/components/Modals/ProfilePictureModal';
import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';
import useModal from '@/hooks/useModal';
import {
  useGetClaimedAuctionNftsPerUserQuery,
  useGetUnclaimedAuctionNftsPerUserQuery,
} from '@/store/services/auctionsReducer';
import Link from 'next/link';

function profile() {
  const { data: sessionData } = useSession();
  const {
    data: userData,
    isFetching: isFetchingUser,
    isError: isFetchUserError,
  } = useGetUserQuery();
  const { data: claimedPrizes } = useGetClaimedPrizesByUserQuery(sessionData?.address as string, {
    skip: !sessionData,
  });
  const { data: unclaimedPrizes } = useGetUnclaimedPrizesByUserQuery(
    sessionData?.address as string,
    {
      skip: !sessionData,
    }
  );
  const { data: claimedAuctionNfts } = useGetClaimedAuctionNftsPerUserQuery(undefined, {
    skip: !sessionData,
  });
  const { data: unclaimedAuctionNfts } = useGetUnclaimedAuctionNftsPerUserQuery(undefined, {
    skip: !sessionData,
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
  if (isFetchUserError) {
    return <div className='profile-page'>Error</div>;
  }
  const numUnclaimedItems = (unclaimedAuctionNfts?.length || 0) + (unclaimedPrizes?.length || 0);

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
                toast.success('copied address');
              }}
            >
              {shortenAddress(userData?.walletAddress as string)}
            </div>
            {/*
            <div className='account-card__private-info-pina'>7021 ASH</div>
						*/}
          </div>
          <h1 className='account-card__private-email'>{userData?.email}</h1>
        </div>
      </div>
      <div className='collection'>
        <div className='collection__header'>
          My Collection
          {numUnclaimedItems > 0 && (
            <div className='collection__claimable'>
              <Link href='/rewards'>
                <>
                  You have {numUnclaimedItems} NFT {numUnclaimedItems > 1 && 's'} to claim. Click
                  here to view {numUnclaimedItems > 1 ? 'them' : 'it'}!
                </>
              </Link>
            </div>
          )}
        </div>
        <div className='collection__grid'>
          {claimedPrizes?.map((p: GamePrize) => {
            return (
              <div className='collection__tile'>
                <div className='collection__tile-img'>
                  <Image src={p.s3Path} layout='fill' objectFit='cover' />
                </div>
                <div className='collection__tile-details'>
                  <div className='collection__tile-artist-pfp'>
                    <Image src={p.artistProfilePicture} layout='fill' objectFit='cover' />
                  </div>
                  <div className='collection__tile-artist-info'>
                    <div className='collection__tile-nft-name'>{p.nftName}</div>
                    <div className='collection__tile-artist-name'>by {p.artistDisplayName}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {claimedAuctionNfts?.map((p: GamePrize) => {
            return (
              <div className='collection__tile'>
                <div className='collection__tile-img'>
                  <Image src={p.s3Path} layout='fill' objectFit='cover' />
                </div>
                <div className='collection__tile-details'>
                  <div className='collection__tile-artist-pfp'>
                    <Image src={p.artistProfilePicture} layout='fill' objectFit='cover' />
                  </div>
                  <div className='collection__tile-artist-info'>
                    <div className='collection__tile-nft-name'>{p.nftName}</div>
                    <div className='collection__tile-artist-name'>by {p.artistDisplayName}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default profile;
