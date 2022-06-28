import Connect from '@/components/Connect';
import { BaseMedia } from '@/components/Media';

interface SocialLink {
  icon: string;
  link: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  { icon: '/telegram.svg', link: '' },
  { icon: '/discord.svg', link: '' },
  { icon: '/opensea.svg', link: '' },
  { icon: '/medium.svg', link: '' },
  { icon: '/insta.svg', link: '' },
  { icon: '/twitter.svg', link: '' },
  { icon: '/uniswap.svg', link: '' },
];

export default function HiddenMenu() {
  return (
    <div className='hidden-menu'>
      <div className='hidden-menu__socials'>
        {SOCIAL_LINKS.map(({ icon, link }: SocialLink) => {
          const src = '/socials' + icon;
          return (
            <div className='hidden-menu__socials-icon'>
              <BaseMedia src={src} isVideo={false}></BaseMedia>
            </div>
          );
        })}
      </div>
      <Connect />
    </div>
  );
}
