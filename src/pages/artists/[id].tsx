import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { User } from '@prisma/client';
import prisma from '@/prisma/client';
import Hero from '@/components/Hero';
import { getIndividualArtistsPageData, getIndividualArtistsPagePaths } from '@/prisma/functions';
Hero;

interface Props {
  artist: User;
}

export default function artist({ artist }: Props) {
  return (
    <div className='artist-page page' data-cy='artist-page'>
      <Hero imgSrc={artist.profilePicture || '/'} />
    </div>
  );
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
  if (!params) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const artist = await getIndividualArtistsPageData(prisma, String(params.id));

  if (!artist) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  return { props: { artist } };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = await getIndividualArtistsPagePaths(prisma);
  return { paths, fallback: 'blocking' };
}
