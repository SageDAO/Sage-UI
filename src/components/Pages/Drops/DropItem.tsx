import Countdown from '@/components/Countdown';
import { BaseMedia } from '@/components/Media/BaseMedia';
import useDrop, { UseDropArgs } from '@/hooks/useDrop';

interface Props extends UseDropArgs {}

export default function DropItem({ drop, artist, Lotteries, Auctions }: Props) {
  const {
    bannerImgSrc,
    dropName,
    artistName,
    startTime,
    status: dropStatus,
    dropDescription,
    goToDropOnClick,
  } = useDrop({
    drop,
    artist,
    Lotteries,
    Auctions,
  });
  const buttonDisplay = 'View Drop Artworks';
  const counterDisplay =
    dropStatus === 'Upcoming' ? (
      <Countdown endTime={startTime} />
    ) : (
      <div>{dropStatus.toUpperCase()}</div>
    );

  return (
    <div key={drop.id} className='drops-page__drop'>
      <div className='drops-page__drop-header'>
        <h3 className='drops-page__drop-header-title'>
          <i className='drops-page__drop-header-title-name'>
            {dropName}, by {artistName}
          </i>
          <span className='drops-page__drop-header-title-artist'></span>
        </h3>
        {dropStatus !== 'Done' && (
          <div className='drops-page__drop-header-countdown' data-status={dropStatus}>
            {counterDisplay}
          </div>
        )}
      </div>
      <BaseMedia src={bannerImgSrc} className='drops-page__drop-backdrop' />
      <div onClick={goToDropOnClick} className='drops-page__drop-focus'>
        <BaseMedia src={bannerImgSrc} />
      </div>
      <div className='drops-page__drop-content'>
        <div
          onClick={goToDropOnClick}
          className='drops-page__drop-content-btn'
          data-status={dropStatus}
        >
          {buttonDisplay}
        </div>
        <p className='drops-page__drop-content-description'>{dropDescription}</p>
      </div>
    </div>
  );
}
