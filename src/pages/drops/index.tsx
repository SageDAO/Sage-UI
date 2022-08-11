import React from 'react';
import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import useDropDown from '@/hooks/useDropDown';
import Logotype from '@/components/Logotype';
import { BaseMedia } from '@/components/Media';
import { Lottery_include_Nft } from '@/prisma/types';
import prisma from '@/prisma/client';
import Image from 'next/image';
import Countdown from '@/components/Countdown';
import { computeDropStatus } from '@/utilities/status';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getDropsPageData } from '@/prisma/functions';
import System, { computeDropSystems } from '@/components/Icons/System';

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
  const { currentOption, setCurrentOption } = useDropDown(['Most Recent']);
  const router = useRouter();
  return (
    <div className='drops-page'>
      <section className='drops-page__header'>
        <Logotype />
        <div className='drops-page__subheader'>
          <div className='drops-page__subheader-top'>
            <div className='drops-page__subheader-content'>
              <div className='drops-page__subheader-label'>
                sage curated live and upcoming drops.
              </div>
              <p className='drops-page__subheader-info'>
                SAGE UPCOMING DROPS ARE CAREFULLY CURATED TO MEET THE HIGHEST VISUAL <br />{' '}
                STANDARDS AND NEW STRUCTURES IN NFT ASSETS. A VISION IN THE CRYPTO SPACE.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className='drops-page__drops-section'>
        {drops.map((d) => {
          const { status, startTime } = computeDropStatus(d);
          const counterDisplay = status === 'Upcoming' ? <Countdown endTime={startTime} /> : status;
          const buttonDisplay = status === 'Upcoming' ? 'get notifications' : 'View Drop Artworks';
          const { drawings, lotteries } = filterLotteries(d.Lotteries);
          const systems = computeDropSystems({
            lotteries,
            auctions: d.Auctions,
            drawings,
          });
          async function buttonHandler() {
            if (status === 'Upcoming') {
              //TODO: handle notifications
              toast.warning('not implemented!');
              return;
            }
            await router.push(`/drops/${d.id}`);
          }
          return (
            <div key={d.id} className='drops-page__drop'>
              <div className='drops-page__drop-header'>
                <h1 className='drops-page__drop-header-title'>
                  {d.name} by {d.NftContract.Artist.username}
                </h1>
                <div className='drops-page__drop-header-countdown' data-status={status}>
                  {counterDisplay}
                </div>
              </div>
              <Image
                src={d.bannerImageS3Path}
                objectFit={'cover'}
                className='drops-page__drop-backdrop'
                layout='fill'
                draggable={false}
              />
              <div className='drops-page__drop-focus'>
                <Image
                  draggable={false}
                  src={d.bannerImageS3Path}
                  objectFit={'cover'}
                  layout='fill'
                />
              </div>
              <div className='drops-page__drop-content'>
                <div
                  onClick={buttonHandler}
                  className='drops-page__drop-content-btn'
                  data-status={status}
                >
                  {buttonDisplay}
                </div>
                <p className='drops-page__drop-content-description'>{d.description}</p>
              </div>
            </div>
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
