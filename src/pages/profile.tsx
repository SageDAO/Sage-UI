import React from 'react';
import { PfpImage } from '@/components/Media';
import { useSession } from 'next-auth/react';
import LoaderDots from '@/components/LoaderDots';
import { Tab } from '@headlessui/react';
import useTabs from '@/hooks/useTabs';
import ProfilePanel from '@/components/Pages/Profile/ProfilePanel';
import CollectionPanel from '@/components/Pages/Profile/CollectionPanel';
import Balances from '@/components/Pages/Profile/Balances';
import CreationsPanel from '@/components/Pages/Profile/CreationsPanel';
import SageFullLogoSVG from '@/public/branding/sage-full-logo.svg';
import { useGetUserQuery, useSignOutMutation } from '@/store/usersReducer';

type TabItem = {
  name: string;
  subheader?: string;
  panel?: any;
  disabled?: boolean;
};

function profile() {
  const { data: sessionData } = useSession();
  const { data: userData, isFetching: isFetchingUser } = useGetUserQuery(undefined, {
    skip: !sessionData,
  });
  const [signOut] = useSignOutMutation();

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
    { name: 'bids and purchases', panel: null, subheader: 'your bids and purchases' },
    {
      name: 'creations / mint',
      panel: CreationsPanel(),
      subheader: 'upload a new artwork to your profile',
    },
    { name: 'settings', panel: null, disabled: true },
  ];

  if (!sessionData) {
    return <div className='profile-page'>sign in to view profile</div>;
  }
  if (!userData && isFetchingUser) {
    return <LoaderDots />;
  }

  return (
    <Tab.Group as='div' className='profile-page' vertical selectedIndex={selectedTabIndex}>
      <div>
        <SageFullLogoSVG className='profile-page__sage-logo-svg' />
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
          <button onClick={() => signOut()} className='profile-page__tabs-tab'>
            log out
          </button>
        </Tab.List>
      </div>
      <div className='profile-page__main'>
        <Balances />
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
      </div>
    </Tab.Group>
  );
}

export default profile;
