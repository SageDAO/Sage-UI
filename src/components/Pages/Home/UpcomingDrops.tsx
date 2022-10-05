import { getHomePageData } from '@/prisma/functions';
import React from 'react';
import { computeDropStatus } from '@/utilities/status';
import { BaseMedia } from '@/components/Media/BaseMedia';
import Countdown from '@/components/Countdown';
import useWindowDimensions from '@/hooks/useWindowSize';
import useSageRoutes from '@/hooks/useSageRoutes';
import { transformTitle } from '@/utilities/strings';
import useDrop, { UseDropArgs } from '@/hooks/useDrop';

interface Props {
  upcomingDrops: Awaited<ReturnType<typeof getHomePageData>>['upcomingDrops'];
}

export default function UpcomingDrops({ upcomingDrops }: Props) {
  const { pushToDrops } = useSageRoutes();
  const { isMobile } = useWindowDimensions();
  if (isMobile) {
    const midPoint: number = Math.floor(upcomingDrops.length / 2);
    const rowData1 = upcomingDrops.slice(0, midPoint);
    const rowData2 = upcomingDrops.slice(midPoint, upcomingDrops.length);
    const rows = new Array(rowData1, rowData2);
    return (
      <React.Fragment>
        {rows.map((row, i: number) => {
          return (
            <div key={i} className='home-page__upcoming-drops-grid--mobile'>
              <div className='home-page__upcoming-drops-row--mobile'>
                {row.map((d) => {
                  return (
                    <UpcomingDropsTile
                      Lotteries={d.Lotteries}
                      Auctions={d.Auctions}
                      drop={d}
                      artist={d.NftContract.Artist}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
  return (
    <div className='home-page__upcoming-drops-grid'>
      {upcomingDrops.map((d, i: number) => {
        if (i > 3) return null;
        const src = d.bannerImageS3Path;
        let shouldTileSpanTwoColumns: boolean = false;
        const isIndexEven = Boolean(i % 2 === 0);
        const nextIndexNull = Boolean(!upcomingDrops[i + 1]);
        if (isIndexEven && nextIndexNull) {
          shouldTileSpanTwoColumns = true;
        }
        function onClick() {
          pushToDrops(d.id);
        }
        const { startTime, status } = computeDropStatus(d);
        const display =
          status === 'Upcoming' ? <Countdown endTime={startTime} /> : status.toUpperCase();
        return (
          <UpcomingDropsTile
            Lotteries={d.Lotteries}
            Auctions={d.Auctions}
            drop={d}
            artist={d.NftContract.Artist}
          />
        );
      })}
    </div>
  );
}

interface UpcomingDropsTileProps extends UseDropArgs {}

function UpcomingDropsTile(props: UpcomingDropsTileProps) {
  const {
    goToDropOnClick,
    status: dropStatus,
    statusDisplay,
    bannerImgSrc,
    startTime,
    artistName,
    dropName,
  } = useDrop(props);
  return (
    <div className='home-page__upcoming-drops-tile' onClick={goToDropOnClick}>
      {dropStatus !== 'Done' && (
        <div className='home-page__upcoming-drops-countdown' data-status={dropStatus}>
          {dropStatus === 'Upcoming' ? <Countdown endTime={startTime} /> : statusDisplay}
        </div>
      )}
      <BaseMedia src={bannerImgSrc} />
      <h3 className='home-page__upcoming-drops-tile-tag'>
        <span className='home-page__upcoming-drops-tile-tag-item'>
          <i className='home-page__upcoming-drops-tile-tag-item-name'>{dropName}</i>
          <pre /> by {artistName}
        </span>
      </h3>
    </div>
  );
}
