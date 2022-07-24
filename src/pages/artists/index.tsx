import Logotype from '@/components/Logotype';
import ArtistsRow from '@/components/Pages/Artists/Row';
import prisma from '@/prisma/client';
import { getArtistsPageData } from '@/prisma/functions';

export interface Props {
  artists: Awaited<ReturnType<typeof getArtistsPageData>>;
}

export default function artists({ artists }: Props) {
  return (
    <div className='artists-page page'>
      <div className='artists-page__logotype'>
        <Logotype />
      </div>
      <ArtistsRow artists={artists}></ArtistsRow>
      <ArtistsRow artists={artists}></ArtistsRow>
    </div>
  );
}

export async function getStaticProps() {
  const artists = await getArtistsPageData(prisma);

  return {
    props: {
      artists,
    },
    revalidate: 60,
  };
}
