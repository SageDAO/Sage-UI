import { useGetUserQuery } from '@/store/usersReducer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEnsName } from 'wagmi';
import { PfpImage } from '../Media';
import PersonalizedMessage from '../PersonalizedMessage';
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
  const { data: sessionData } = useSession();
  const { data: userData } = useGetUserQuery(undefined, {
    skip: !sessionData,
  });
  const { data: ensData } = useEnsName({ address: userData?.walletAddress });

  return (
    <div className='nav__wrapper'>
      <HiddenMenu></HiddenMenu>
      <div className='nav' data-cy='nav'>
        <div className='nav__content'>
          <div className='nav__personal'>
            <div
              onClick={() => {
                router.push('/profile');
              }}
              className='nav__personal-pfp-container'
            >
              <PfpImage className='nav__personal-pfp-src' src={userData?.profilePicture} />
            </div>
            <h1 className='nav__personal-message'>
              <PersonalizedMessage />
            </h1>
          </div>
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
          <div className='nav__search'></div>
        </div>
      </div>
    </div>
  );
}
