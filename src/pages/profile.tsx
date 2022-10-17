import React, { useEffect } from 'react';
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
import { useRouter } from 'next/router';
import { useDisconnect } from 'wagmi';
import { PfpImage } from '@/components/Media/BaseMedia';
import useUserNotifications from '@/hooks/useUserNotifications';
import useSageRoutes from '@/hooks/useSageRoutes';

function profile() {
  const router = useRouter();
  // const { pushToHome } = useSageRoutes();
  const { data: sessionData } = useSession();
  const { data: userData, isFetching: isFetchingUser } = useGetUserQuery(undefined, {
    skip: !sessionData,
  });
  const [signOut] = useSignOutMutation();
  const { selectedTabIndex, setSelectedTabIndex } = useTabs();
  const { disconnect } = useDisconnect();
  const { asPath } = useRouter();

  const { notificationCount, hasNotifications } = useUserNotifications();

  useEffect(() => {
    if (asPath.indexOf('notifications')) {
      setSelectedTabIndex(2);
    }
  }, []);

  async function handleSignOut() {
    signOut();
    disconnect();
    router.push('/');
  }

  if (!userData && isFetchingUser) {
    return <LoaderDots />;
  }

  const isArtist: boolean = userData?.role === 'ARTIST';

  return (
    <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex} vertical>
      <div className='profile-page'>
        <section className='profile-page__upper'>
          <div className='profile-page__logotype-container'>
            <SageFullLogoSVG
              onClick={() => router.push('/')}
              className='profile-page__sage-logo-svg'
            />
          </div>
          <Balances />
        </section>
        <h1 className='profile-page__header'>IN AND OUTGOING BIDS</h1>
        <section className='profile-page__main'>
          <div className='profile-page__left'>
            <div className='profile-page__pfp-section'>
              <div className='profile-page__pfp-container'>
                <PfpImage src={userData?.profilePicture}></PfpImage>
              </div>
              <div className='profile-page__pfp-section-right'>
                <p className='profile-page__pfp-section-username'>{userData?.username}</p>
                <p className='profile-page__pfp-section-role'>{userData?.role}</p>
              </div>
            </div>
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
                    <button
                      data-active={selected}
                      data-type='notifications'
                      className='profile-page__tabs-tab  '
                    >
                      notifications
                      {hasNotifications && (
                        <span className='profile-page__tabs-tab-notifications-counter'>
                          {notificationCount}
                        </span>
                      )}
                    </button>
                  );
                }}
              </Tab>
              {isArtist && (
                <Tab as={React.Fragment}>
                  {({ selected }) => {
                    return (
                      <button
                        disabled={!isArtist}
                        data-active={selected}
                        className='profile-page__tabs-tab'
                      >
                        MINT
                      </button>
                    );
                  }}
                </Tab>
              )}
              <button onClick={handleSignOut} className=' profile-page__log-out-btn'>
                log out
              </button>
            </Tab.List>
          </div>
          <div className='profile-page__right'>
            <Tab.Panels>
              <Tab.Panel as='div' className='profile-page__tabs-panel'>
                <ProfilePanel isArtist={isArtist} />
              </Tab.Panel>
              <Tab.Panel as='div' className='profile-page__tabs-panel'>
                <CollectionPanel />
              </Tab.Panel>
              <Tab.Panel as='div' className='profile-page__tabs-panel'>
                <NotificationsPanel />
              </Tab.Panel>
              {isArtist && (
                <Tab.Panel as='div' className='profile-page__tabs-panel'>
                  <CreationsPanel />
                </Tab.Panel>
              )}
            </Tab.Panels>
          </div>
        </section>
      </div>
    </Tab.Group>
  );
}

export default profile;
