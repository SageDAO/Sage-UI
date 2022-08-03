import React from 'react';
import { useSession } from 'next-auth/react';
import LoaderDots from '@/components/LoaderDots';
import { Tab } from '@headlessui/react';
import useTabs from '@/hooks/useTabs';
import ProfilePanel from '@/components/Pages/Profile/ProfilePanel';
import CollectionPanel from '@/components/Pages/Profile/CollectionPanel';
import NotificationsPanel from '@/components/Pages/Profile/NotificationsPanel';
import Balances from '@/components/Pages/Profile/Balances';
import CreationsPanel from '@/components/Pages/Profile/CreationsPanel';
import SageFullLogoSVG from '@/public/branding/sage-full-logo.svg';
import { useGetUserQuery, useSignOutMutation } from '@/store/usersReducer';
import { animated, Transition, Spring } from 'react-spring';

function profile() {
  const { data: sessionData } = useSession();
  const { data: userData, isFetching: isFetchingUser } = useGetUserQuery(undefined, {
    skip: !sessionData,
  });
  const [signOut] = useSignOutMutation();
  const { selectedTabIndex, setSelectedTabIndex } = useTabs();

  if (!sessionData) {
    return <div className='profile-page'>sign in to view profile</div>;
  }

  if (!userData && isFetchingUser) {
    return <LoaderDots />;
  }

  const isArtist: boolean = userData?.role === 'ARTIST';

  return (
    <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex} vertical>
      <div className='profile-page'>
        <div>
          <SageFullLogoSVG className='profile-page__sage-logo-svg' />
          <Tab.List className='profile-page__tabs'>
            <Tab as={React.Fragment}>
              {({ selected }) => {
                return (
                  <button data-active={selected} className='profile-page__tabs-tab'>
                    profile
                  </button>
                );
              }}
            </Tab>
            <Tab as={React.Fragment}>
              {({ selected }) => {
                return (
                  <button data-active={selected} className='profile-page__tabs-tab'>
                    collection
                  </button>
                );
              }}
            </Tab>
            <Tab as={React.Fragment}>
              {({ selected }) => {
                return (
                  <button data-active={selected} className='profile-page__tabs-tab'>
                    notifications
                  </button>
                );
              }}
            </Tab>
            <Tab as={React.Fragment}>
              {({ selected }) => {
                return (
                  <button
                    disabled={!isArtist}
                    data-active={selected}
                    className='profile-page__tabs-tab'
                  >
                    creations / mint
                  </button>
                );
              }}
            </Tab>
            <button onClick={() => signOut()} className='profile-page__tabs-tab'>
              log out
            </button>
          </Tab.List>
        </div>
        <div className='profile-page__main'>
          <Balances />
          <Tab.Panels>
            <Tab.Panel as='div' className='profile-page__tabs-panel'>
              <ProfilePanel />
            </Tab.Panel>
            <Tab.Panel as='div' className='profile-page__tabs-panel'>
              <CollectionPanel />
            </Tab.Panel>
            <Tab.Panel as='div' className='profile-page__tabs-panel'>
              <NotificationsPanel />
            </Tab.Panel>
            <Tab.Panel as='div' className='profile-page__tabs-panel'>
              <CreationsPanel />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </div>
    </Tab.Group>
  );
}

export default profile;
