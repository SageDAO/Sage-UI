import { useGetUserQuery } from '@/store/usersReducer';
import { useRouter } from 'next/router';
import { useAccount, useEnsName } from 'wagmi';
import { PfpImage } from '../Media';
import PersonalizedMessage from '../PersonalizedMessage';
import UserHandle from '../UserHandle';

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
    name: 'Press',
    url: '/press',
  },
];

export default function Nav() {
  const router = useRouter();
  const { data: userData } = useGetUserQuery();
  const { data: ensData } = useEnsName({ address: userData?.walletAddress });
  return (
    <div
      className='nav'
      data-cy='nav'
      onClick={() => {
        router.push('/profile');
      }}
    >
      <div className='nav__personal'>
        <div className='nav__personal-pfp-container'>
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
  );
}
