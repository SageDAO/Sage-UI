import shortenAddress from '@/utilities/shortenAddress';
import Link from 'next/link';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { BaseImage, PfpImage } from './Image';
import Countdown from '@/components/Countdown';
import { computeDropStatus } from '@/utilities/status';

interface Props {
  drop: Drop_include_GamesAndArtist;
}

export default function Drop({ drop }: Props) {
  const { status, startTime, endTime } = computeDropStatus(drop);
  return (
    <div className='drop'>
      <Link href={`drops/${drop.id}`}>
        <div className='drop__thumbnail'>
          <BaseImage src={drop.bannerImageS3Path || '/'} />
        </div>
      </Link>
      <div className='details'>
        <div className='artist'>
          <div className='artist-pfp'>
            <PfpImage src={drop.Artist.profilePicture || undefined} />
          </div>
          <h1 className='artist-name'>
            {drop.Artist.username || shortenAddress(drop.artistAddress)}
          </h1>
        </div>
        <div className='drop__status' data-status='drawn'>
          {status === 'Done' && <h1>DRAWN – {new Date(endTime).toLocaleDateString()}</h1>}
          {status === 'Live' && (
            <Countdown className='status__countdown' endTime={endTime} data-color='purple' />
          )}
          {status === 'Upcoming' && <Countdown className='status__countdown' endTime={startTime} />}
          {/*status === 'Upcoming' && startTime - Date.now() < 860000 && (
            <h1>SOON™ – {new Date(startTime).toLocaleDateString()}</h1>
          )*/}
        </div>
      </div>
    </div>
  );
}
