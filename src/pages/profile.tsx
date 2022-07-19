import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useGetUserQuery } from '@/store/usersReducer';
import ProfilePictureModal from '@/components/Modals/ProfilePictureModal';
import { parameters } from '@/constants/config';
import useModal from '@/hooks/useModal';
import { PfpImage } from '@/components/Media';
import { useSession } from 'next-auth/react';
import LoaderDots from '@/components/LoaderDots';
import { Tab } from '@headlessui/react';
import useTabs from '@/hooks/useTabs';
import Image from 'next/image';
import ProfilePanel from '@/components/Pages/Profile/ProfilePanel';
import CollectionPanel from '@/components/Pages/Profile/CollectionPanel';
import { useGetPointsBalanceQuery } from '@/store/pointsReducer';

type TabItem = {
  name: string;
  subheader?: string;
  panel?: any;
  disabled?: boolean;
};

function profile() {
  const { data: sessionData } = useSession();
  const { data: userData, isFetching: isFetchingUser } = useGetUserQuery();
  const { data: pointsData } = useGetPointsBalanceQuery();
  const { data: accountData } = useAccount();
  const { data: walletBalance } = useBalance({
    token: parameters.ASHTOKEN_ADDRESS,
    addressOrName: userData?.walletAddress,
  });
  const { ASHTOKEN_ADDRESS } = parameters;
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

  const { handleTabsClick, selectedTabIndex } = useTabs();

  const tabItems: TabItem[] = [
    {
      name: 'profile',
      panel: ProfilePanel(),
      subheader: 'complete or update your profile on sage',
    },
    { name: 'notifications', panel: null, disabled: true },
    {
      name: 'collection',
      panel: CollectionPanel(),
      subheader: 'your collection of artwork on sage',
    },
    { name: 'bids and purchases', panel: null },
    { name: 'creations / mint', panel: null },
    { name: 'settings', panel: null },
    { name: 'log out', panel: null },
  ];

  if (!sessionData) {
    return <div className='profile-page'>sign in to view profile</div>;
  }
  if (!userData && isFetchingUser) {
    return <LoaderDots />;
  }

  return (
    <Tab.Group
      as='div'
      defaultIndex={0}
      className='profile-page'
      vertical
      selectedIndex={selectedTabIndex}
    >
      <ProfilePictureModal
        isOpen={isProfilePicModalOpen}
        closeModal={closeProfilePicModal}
        title='Profile Picture'
      />
      <section className='profile-page__menu'>
        <div className='profile-page__sage-logo-container'>
          <Image
            src='/branding/sage-full-logo.svg'
            layout='fill'
            className='profile-page__sage-logo-img'
          ></Image>
        </div>
        <div className='profile-page__pfp-container'>
          <PfpImage src={userData?.profilePicture}></PfpImage>
        </div>
        <Tab.List className='profile-page__tabs'>
          {tabItems.map((t, i: number) => {
            const isActive: boolean = i === selectedTabIndex;
            return (
              <Tab
                as='button'
                disabled={t.disabled}
                data-active={isActive}
                onClick={() => handleTabsClick(i)}
                key={t.name}
                className='profile-page__tabs-tab'
              >
                {t.name}
              </Tab>
            );
          })}
        </Tab.List>
      </section>
      <section className='profile-page__main'>
        <div className='profile-page__balances'>
          <div className='profile-page__balances-points'>
            <h1 className='profile-page__balances-points-value'>{pointsData}</h1>
            <h1 className='profile-page__balances-points-label'>your pixel balance</h1>
          </div>
          <div className='profile-page__balances-token'>
            <h1 className='profile-page__balances-token-value'>{walletBalance?.formatted}</h1>
            <h1 className='profile-page__balances-points-label'>your ash balance</h1>
          </div>
        </div>
        <Tab.Panels as='div' className='profile-page__tabs-panels'>
          {tabItems.map((item) => {
            return (
              <Tab.Panel as='div' key={item.name} className='profile-page__tabs-panel'>
                <h1 className='profile-page__tabs-panel-header'>
                  {item.name}
                  <span className='profile-page__tabs-panel-subheader'>{item.subheader}</span>
                </h1>
                {item.panel}
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </section>
    </Tab.Group>
  );
}

export default profile;
