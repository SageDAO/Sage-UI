import React from 'react';
import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import Logotype from '@/components/Logotype';
import { Lottery_include_Nft } from '@/prisma/types';
import prisma from '@/prisma/client';
import { getDropsPageData } from '@/prisma/functions';
import DropItem from '@/components/Pages/Drops/DropItem';

interface Props {
  drops: Awaited<ReturnType<typeof getDropsPageData>>;
}

function filterLotteries(unfiltered: Lottery_include_Nft[]) {
  if (unfiltered.length === 0) return { drawings: [], lotteries: unfiltered };
  const drawings = unfiltered.filter((l) => l.Nfts.length === 1);
  const lotteries = unfiltered.filter((l) => l.Nfts.length > 1);
  return { drawings, lotteries };
}

function drops({ drops }: Props) {
  return (
    <div className='drops-page'>
      <section className='drops-page__header'>
        <Logotype />
        <div className='drops-page__subheader'>
          <div className='drops-page__subheader-top'>
            <div className='drops-page__subheader-content'>
              <h1 className='drops-page__subheader-label'>SAGE-Curated live and upcoming drops.</h1>
              <h2 className='drops-page__subheader-info'>
                SAGE drops are carefully curated to meet the standards and new structures in NFT
                assets.
              </h2>
            </div>
          </div>
        </div>
      </section>
      <section className='drops-page__drops-section'>
        {drops.map((d) => {
          return (
            <DropItem
              key={d.id}
              drop={d}
              Lotteries={d.Lotteries}
              Auctions={d.Auctions}
              artist={d.NftContract.Artist}
            />
          );
        })}
      </section>
    </div>
  );
}

export default drops;

export async function getStaticProps(
  _context: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  const drops = await getDropsPageData(prisma);

  return {
    props: {
      drops,
    },
  };
}
