import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { toast } from 'react-toastify';
import { useGetUserQuery } from '@/store/usersReducer';
import shortenAddress from '@/utilities/shortenAddress';
import EditProfileModal from '@/components/Modals/EditProfileModal';
import ProfilePictureModal from '@/components/Modals/ProfilePictureModal';
import { parameters } from '@/constants/config';
import useModal from '@/hooks/useModal';
import { MyCollection } from '@/components/MyCollection';
import { PfpImage } from '@/components/Media';
import { useSession } from 'next-auth/react';
import LoaderDots from '@/components/LoaderDots';
import { Tab } from '@headlessui/react';
import useTabs from '@/hooks/useTabs';
import Image from 'next/image';
import ProfilePanel from '@/components/Pages/Profile/ProfilePanel';

type TabItem = {
  name: string;
  panel?: any;
};

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

  const { handleTabsClick, selectedTabIndex } = useTabs();

  const tabItems: TabItem[] = [
    { name: 'profile', panel: ProfilePanel() },
    { name: 'notifications', panel: null },
    { name: 'collection', panel: null },
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
    <Tab.Group as='div' className='profile-page' vertical selectedIndex={selectedTabIndex}>
      <EditProfileModal isOpen={isEditModalOpen} closeModal={closeEditModal} title='Edit Profile' />
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
          {tabItems.map((t) => {
            return (
              <Tab as='div' key={t.name} className='profile-page__tabs-tab'>
                {t.name}
              </Tab>
            );
          })}
        </Tab.List>
      </section>
      <section className='profile-page__main'>
        <div className='profile-page__balances'>
          <div className='profile-page__balances-points'>
            <h1 className='profile-page__balances-points-value'>1000000</h1>
            <h1 className='profile-page__balances-points-label'>your pixel balance</h1>
          </div>
          <div className='profile-page__balances-token'>
            <h1 className='profile-page__balances-token-value'>1000000</h1>
            <h1 className='profile-page__balances-points-label'>your ash balance</h1>
          </div>
        </div>
        <Tab.Panels as='div' className='profile-page__tabs-panels'>
          {tabItems.map((item) => {
            return (
              <Tab.Panel as='div' key={item.name} className='profile-page__tabs-panel'>
                <h1 className='profile-page__tabs-panel-header'>
                  {item.name}
                  <span className='profile-page__tabs-panel-subheader'>some subheader</span>
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
