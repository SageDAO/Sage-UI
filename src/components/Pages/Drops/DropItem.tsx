import Countdown from '@/components/Countdown';
import { BaseMedia, PfpImage } from '@/components/Media/BaseMedia';
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
    goToArtistOnClick,
    goToDropOnClick,
  } = useDrop({
    drop,
    artist,
    Lotteries,
    Auctions,
  });
  const buttonDisplay = dropStatus === 'Upcoming' ? <Countdown endTime={startTime} /> : 'View Drop';

  return (
    <div key={drop.id} className='drops-page__drop'>
      <div className='drops-page__drop-header' onClick={goToDropOnClick}>
        <h3 className='drops-page__drop-header-title'>{dropName}</h3>
        <BaseMedia src={bannerImgSrc} className='drops-page__drop-backdrop' />
      </div>

      <div className='drops-page__drop-content'>
        <div className='drops-page__drop-artist'>
          <div className='drops-page__drop-artist-pfp' onClick={goToArtistOnClick}>
            <PfpImage src={artist.profilePicture}></PfpImage>
          </div>
          <div className='drops-page__drop-artist-info'>
            <p className='drops-page__drop-drop-name'>{dropName}</p>
            <p className='drops-page__drop-artist-name'>BY {artist.username}</p>
          </div>
        </div>
        <div
          onClick={goToDropOnClick}
          className='drops-page__drop-content-btn'
          data-status={dropStatus}
        >
          {buttonDisplay}
        </div>
      </div>
    </div>
  );
}
