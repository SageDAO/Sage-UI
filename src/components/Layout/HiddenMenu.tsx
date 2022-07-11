import Connect from '@/components/Connect';
import Socials from '@/components/Socials';
import useTheme from '@/hooks/useTheme';

export default function HiddenMenu() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='hidden-menu'>
      <button className='theme-switch' onClick={toggleTheme}>{theme}</button>
      <Connect />
    </div>
  );
}
