import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import prisma from '@/prisma/client';
import { Nft } from '@prisma/client';
import { Lottery_include_Nft, Auction_include_Nft } from '@/prisma/types';
import { useTicketCount } from '@/hooks/useTicketCount';
import React from 'react';
import Logotype from '@/components/Logotype';
import { getIndividualDropsPagePaths, getIndividualDropsPageData } from '@/prisma/functions';
import System from '@/components/Icons/System';
import AuctionTile from '@/components/Pages/DropIndividual/AuctionTile';
import DrawingTile from '@/components/Pages/DropIndividual/DrawingTile';
import LotteryTile from '@/components/Pages/DropIndividual/LotteryTile';
import { useSession } from 'next-auth/react';
import useDrop from '@/hooks/useDrop';
import { BaseMedia, PfpImage } from '@/components/Media/BaseMedia';

//type drop page data
type DropPageData = Awaited<ReturnType<typeof getIndividualDropsPageData>>;

//determines the type interface received from getStaticProps()
interface Props {
  drop: DropPageData;
  artist: DropPageData['NftContract']['Artist'];
  lotteries: DropPageData['Lotteries'];
  drawings: DropPageData['Lotteries'];
  auctions: DropPageData['Auctions'];
}

function filterDrawingsFromLottery(array: Lottery_include_Nft[]) {
  return {
    drawings: array.filter((l: Lottery_include_Nft) => unique(l.Nfts, 's3Path').length == 1),
    lotteries: array.filter((l: Lottery_include_Nft) => unique(l.Nfts, 's3Path').length > 1),
  };
}

function unique(array: any[], propertyName: string) {
  return array.filter((e, i) => array.findIndex((a) => a[propertyName] === e[propertyName]) === i);
}

function computeEditionSize(nfts: Nft[]) {
  let editionSize = 0;
  const uniqueImages = unique(nfts, 's3Path');
  uniqueImages.forEach((nft) => {
    editionSize += nft.numberOfEditions;
  });
  return editionSize;
}

export default function drop({ drop, auctions, artist, lotteries, drawings }: Props) {
  const { systemTypes, bannerImgSrc, dropName, dropDescription, artistName, createdAt } = useDrop({
    drop,
    Auctions: auctions,
    Lotteries: drawings,
    artist,
  });
  const { data: sessionData } = useSession();
  const ticketCountMap = useTicketCount(
    new Array().concat(drawings, lotteries),
    sessionData?.address as string
  );
  return (
    <>
      <div className='drop-page__banner-base'>
        <BaseMedia src={bannerImgSrc} />
      </div>
      <div className='drop-page'>
        <header className='drop-page__header'>
          <div className='drop-page__header-logotype'>
            <Logotype />
          </div>
          <section className='drop-page__header-drop-info'>
            <div className='drop-page__header-main-column'>
              <h1 className='drop-page__header-drop-name'>
                <i className='drop-page__header-drop-name-italic'>{dropName},</i> by {artistName}
              </h1>
              <p className='drop-page__header-drop-description'>{dropDescription}</p>
              <div className='drop-page__header-drop-details'>
                <p className='drop-page__header-drop-details-item'>
                  <strong>Minted by:</strong> {artistName}
                </p>
                <p className='drop-page__header-drop-details-item'>
                  <strong>Creation date:</strong> {createdAt}
                </p>
                <p className='drop-page__header-drop-details-item'>
                  <strong>Systems in this drop:</strong>
                  {systemTypes.map((type) => {
                    return (
                      <div key={type} className='drop-page__systems-icon'>
                        <System type={type}></System>
                      </div>
                    );
                  })}
                </p>
              </div>
            </div>
          </section>
        </header>
        <section className='drop-page__content'>
          <div className='drop-page__drop-info'>
            <div className='drop-page__artist'>
              <div className='drop-page__artist-pfp'>
                <PfpImage src={artist.profilePicture}></PfpImage>
              </div>
              <div className='drop-page__artist-info'>
                <p className='drop-page__artist-name'>{artist.username}</p>
                <p className='drop-page__artist-label'>VOID, USA</p>
              </div>
            </div>
            <h3 className='drop-page__drop-info-name'>{drop.name}</h3>
            <p className='drop-page__drop-info-description'>{drop.description}</p>
          </div>
          <div className='drop-page__grid'>
            {auctions.map((a) => {
              return <AuctionTile key={a.id} dropName={drop.name} artist={artist} auction={a} />;
            })}
            {lotteries.map((l) => {
              return (
                <LotteryTile
                  key={l.id}
                  imgSrc={l.Nfts[0].s3PathOptimized}
                  dropName={dropName}
                  artistName={artistName}
                  lottery={l}
                  tickets={ticketCountMap ? ticketCountMap[l.id] : 0}
                />
              );
            })}
            {drawings.map((d) => {
              return (
                <DrawingTile
                  key={d.id}
                  dropName={drop.name}
                  artistName={artistName}
                  drawing={d}
                  tickets={ticketCountMap ? ticketCountMap[d.id] : 0}
                />
              );
            })}
          </div>
        </section>
      </div>
    </>
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

  const drop = await getIndividualDropsPageData(prisma, Number(params.id));

  if (!drop) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const { drawings, lotteries } = filterDrawingsFromLottery(drop.Lotteries);
  const auctions = drop.Auctions;
  const artist = drop.NftContract.Artist;

  return {
    props: {
      drop,
      artist,
      auctions,
      lotteries,
      drawings,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = await getIndividualDropsPagePaths(prisma);
  return { paths, fallback: 'blocking' };
}
