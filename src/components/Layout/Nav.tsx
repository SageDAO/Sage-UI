import { useGetUserQuery } from '@/store/usersReducer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEnsName } from 'wagmi';
import { PfpImage } from '../Media/BaseMedia';
import PersonalizedMessage from '../PersonalizedMessage';
import SearchForm from '../SearchForm';
import HiddenMenu from './HiddenMenu';
interface NavLink {
  name: string;
  url: string;
}

const navLinks: NavLink[] = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Drops',
    url: '/drops',
  },
  {
    name: 'Artists',
    url: '/artists',
  },
  {
    name: 'Apply',
    url: '/artists/submissions',
  },
];

export default function Nav() {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  const { data: userData } = useGetUserQuery(undefined, {
    skip: !sessionData,
  });
  const { data: ensData } = useEnsName({ address: userData?.walletAddress });
  const isSignedIn: boolean = sessionStatus === 'authenticated';
  const shouldShowPersonal: boolean = !router.pathname.includes('/profile');
  const shouldShowSearch: boolean = !router.pathname.includes('/profile');

  return (
    <div className='nav__wrapper'>
      <HiddenMenu></HiddenMenu>
      <div className='nav' data-cy='nav'>
        <div className='nav__content'>
          {shouldShowPersonal && (
            <div className='nav__personal'>
              {isSignedIn && (
                <div
                  onClick={() => {
                    router.push('/profile');
                  }}
                  className='nav__personal-pfp-container'
                >
                  <PfpImage className='nav__personal-pfp-src' src={userData?.profilePicture} />
                </div>
              )}
              <h1 className='nav__personal-message'>
                <PersonalizedMessage />
              </h1>
            </div>
          )}

          <div className='nav__menu'>
            {navLinks.map(({ name, url }: NavLink) => {
              const onClick = () => {
                router.push(url);
              };
              return (
                <div key={name} onClick={onClick} className='nav__menu-link'>
                  {name}
                </div>
              );
            })}
          </div>

          {shouldShowSearch && (
            <div className='nav__search'>
              <div className='nav__search-wrapper'>
                <SearchForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
