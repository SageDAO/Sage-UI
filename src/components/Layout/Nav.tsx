import { useRouter } from 'next/router';

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
  return (
    <div className='nav' data-cy='nav'>
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
    </div>
  );
}
