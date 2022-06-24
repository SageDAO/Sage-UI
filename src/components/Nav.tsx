import { useRouter } from 'next/router';
import Link from 'next/link';
import Connect from '@/components/Connect';
import { BaseMedia } from './Media';
interface NavLink {
  name: string;
  url: string;
}

const navLinks: NavLink[] = [
  {
    name: 'Home',
    url: '/',
  },
  // {
  //   name: 'Drops',
  //   url: '/drops',
  // },
  // { name: 'Artists', url: '/artists' },
  {
    name: 'About',
    url: '/about',
  },
];

export default function Nav() {
  const router = useRouter();
  return (
    <div className='nav' data-cy='nav'>
      <ul>
        <div className='logo'>
          <BaseMedia src='/branding/sage.png' isVideo={false} />
        </div>
        {navLinks.map((n: NavLink) => {
          return (
            <Link key={n.name} href={n.url}>
              <h1 className={`nav-links ${router.pathname == n.url ? 'active' : ''}`}>{n.name}</h1>
            </Link>
          );
        })}
      </ul>
      <div className='right'>
        <Connect />
      </div>
    </div>
  );
}
