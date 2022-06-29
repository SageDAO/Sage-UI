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

export default function Socials() {
  return (
    <div className='socials'>
      {SOCIAL_LINKS.map(({ icon, link }: SocialLink) => {
        const src = '/socials' + icon;
        return (
          <div key={icon} className='socials__icon'>
            <BaseMedia src={src} isVideo={false}></BaseMedia>
          </div>
        );
      })}
    </div>
  );
}
