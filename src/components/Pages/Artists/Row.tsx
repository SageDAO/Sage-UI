import { PfpImage } from '@/components/Media';
import shortenAddress from '@/utilities/shortenAddress';
import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

interface Props {
  artists: User[];
  shouldStartAsymmetric?: boolean;
}

export default function Row({ artists, shouldStartAsymmetric }: Props) {
  const router = useRouter();
  const asymmetricStarterElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldStartAsymmetric) {
      if (asymmetricStarterElement.current) {
        // asymmetricStarterElement.current.scrollIntoView({ inline: 'center', block: 'end' });
        asymmetricStarterElement.current.scroll({
          left: asymmetricStarterElement.current.scrollWidth / 2,
        });
      }
    }
  }, []);

  return (
    <section ref={asymmetricStarterElement} className='artists-page__row'>
      {artists.map((a, i: number) => {
        return (
          <div
            className='artists-page__item'
            onClick={async () => {
              await router.push(`/artists/${a.walletAddress}`);
            }}
            key={i}
          >
            <div className='artists-page__item-img'>
              <PfpImage src={a.profilePicture} />
              <h1 className='artists-page__item-img-text'>
                drop by {a.displayName || a.username || shortenAddress(a.walletAddress)} <br />
                Sage Curated
              </h1>
            </div>
            <div className='artists-page__item-content'>
              <h1 className='artists-page__item-content-header'>{a.displayName}</h1>
              <p className='artists-page__item-content-description'>{a.bio}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}