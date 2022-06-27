import prisma from '@/prisma/client';
import React from 'react';

import { Drop_include_GamesAndArtist } from '@/prisma/types';
import Drop from '@/components/Drop';

interface Props {
  drops: Drop_include_GamesAndArtist[];
}

function home({ drops }: Props) {
  return (
    <div className='home-page' data-cy='home-page'>
      <h1 className='home-page__subheader'>Available Drops</h1>
      <div className='home-page__featured-drops' data-cy='featured-drops'>
        {drops.map((d: Drop_include_GamesAndArtist) => {
          return <Drop drop={d} key={d.id} />;
        })}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  let drops: Drop_include_GamesAndArtist[] = await prisma.drop.findMany({
    where: { approvedAt: { not: null } },
    include: {
      Artist: true,
      Lotteries: { include: { Nfts: true } },
      Auctions: { include: { Nft: true } },
    },
  });

  return {
    props: {
      drops: drops,
    },
    revalidate: 60,
  };
}

export default home;
