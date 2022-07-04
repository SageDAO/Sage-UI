import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { User } from '@prisma/client';
import prisma from '@/prisma/client';
import Hero from '@/components/Hero';
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

  const artist = await prisma.user.findUnique({ where: { walletAddress: String(params.id) } });

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
  let artists: User[] = await prisma.user.findMany({
    where: { role: 'ARTIST' },
    take: 20,
  });

  // Get the paths we want to pre-render based on drops
  const paths = artists.map((artist) => ({
    params: { id: String(artist.walletAddress) },
  }));
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } allows for ISR, if a new page is needed for a new drop then the server will serve the page for the first request and cache static html for all future reqeusts
  return { paths, fallback: 'blocking' };
}
