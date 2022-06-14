import type { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { basePathArtists } from '@/constants/paths';
import { PfpImage } from '@/components/Image';

interface Props {
  artist: User;
}

export default function ArtistTag({ artist }: Props) {
  const router = useRouter();
  return (
    <div
      className='artist-tag'
      onClick={() => router.push(`${basePathArtists}/${artist.walletAddress}`)}
    >
      <div className='artist-tag__pfp'>
        <PfpImage src={artist.profilePicture} />
      </div>
      <div className='artist-tag__handles'>
        <div className='artist-tag__name'>{artist.displayName}</div>
        <div className='artist-tag__username'>@{artist.username}</div>
      </div>
    </div>
  );
}
