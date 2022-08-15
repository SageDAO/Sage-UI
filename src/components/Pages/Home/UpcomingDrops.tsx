import { getHomePageData } from '@/prisma/functions';
import { computeDropStatus } from '@/utilities/status';
import { BaseMedia } from '@/components/Media';
import Countdown from '@/components/Countdown';
import useWindowDimensions from '@/hooks/useWindowSize';
import { useRouter } from 'next/router';

interface Props {
  upcomingDrops: Awaited<ReturnType<typeof getHomePageData>>['upcomingDrops'];
}

export default function UpcomingDrops({ upcomingDrops }: Props) {
  const router = useRouter();
  const { isMobile } = useWindowDimensions();
  if (isMobile) {
    const midPoint: number = Math.floor(upcomingDrops.length / 2);
    const rowData1 = upcomingDrops.slice(0, midPoint);
    const rowData2 = upcomingDrops.slice(midPoint, upcomingDrops.length);
    const rows = new Array(rowData1, rowData2);
    return rows.map((row, i: number) => {
      return (
        <div className='home-page__upcoming-drops-grid--mobile'>
          <div className='home-page__upcoming-drops-row--mobile'>
            {row.map((d) => {
              const src = d.bannerImageS3Path;
              async function onClick() {
                await router.push(`/drops/${d.id}`);
              }
              const text = `${d.name} by ${d.NftContract.Artist.username}`;
              const { startTime, status } = computeDropStatus(d);
              const display = status === 'Upcoming' ? <Countdown endTime={startTime} /> : status;
              return (
                <div className='home-page__upcoming-drops-tile--mobile' key={d.id} onClick={onClick}>
                  <div className='home-page__upcoming-drops-countdown' data-status={status}>
                    {display}
                  </div>
                  <BaseMedia src={src} isVideo={false} />
                  <h1 className='home-page__upcoming-drops-tile-tag'>
                    {text}
                    <br />
                    sage curated
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
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
        async function onClick() {
          await router.push(`/drops/${d.id}`);
        }
        const text = `${d.name} by ${d.NftContract.Artist.username}`;
        const { startTime, status } = computeDropStatus(d);
        const display = status === 'Upcoming' ? <Countdown endTime={startTime} /> : status;
        return (
          <div
            data-span2={String(shouldTileSpanTwoColumns)}
            className='home-page__upcoming-drops-tile'
            key={d.id}
            onClick={onClick}
          >
            <div className='home-page__upcoming-drops-countdown' data-status={status}>
              {display}
            </div>

            <BaseMedia src={src} isVideo={false} />
            <h1 className='home-page__upcoming-drops-tile-tag'>
              {text}
              <br />
              sage curated
            </h1>
          </div>
        );
      })}
    </div>
  );
}
