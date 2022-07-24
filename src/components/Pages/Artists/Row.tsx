import { PfpImage } from '@/components/Media';
import { useRouter } from 'next/router';
import type { Props as ArtistsPageProps } from '../../../pages/artists';

interface Props extends ArtistsPageProps {}

export default function Row({ artists }: Props) {
  const router = useRouter();
  return (
    <section className='artists-page__row'>
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
                drop by {a.walletAddress || a.displayName || a.username} <br />
                Sage Curated
              </h1>
            </div>
            <div className='artists-page__item-content'>
              <h1 className='artists-page__item-content-header'>{a.displayName}</h1>
              <p className='artists-page__item-content-description'>
                PAK, FORMERLY KNOWN AS MURAT PAK, IS A DIGITAL ARTIST, CRYPTOCURRENCY INVESTOR,
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
