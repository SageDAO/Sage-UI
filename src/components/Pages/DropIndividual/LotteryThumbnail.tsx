import { Lottery_include_Nft } from '@/prisma/types';
import { BaseMedia } from '@/components/Media';

interface Props {
  lottery: Lottery_include_Nft;
}
export default function LotteryThumbnail({ lottery }: Props) {
  const uniqueImages = new Set<string>();
  for (const nft of lottery.Nfts) {
    uniqueImages.add(nft.s3Path);
  }
  return (
    <div
      style={{ gridTemplateColumns: `repeat(${uniqueImages.size - 1}, 1fr)` }}
      className='lottery-thumbnail'
    >
      {Array.from(uniqueImages).map((s3Path, i) => {
        return (
          <div key={i} data-item={`lottery-nft-${i}`} className='lottery-thumbnail__item'>
            <BaseMedia src={s3Path}></BaseMedia>
          </div>
        );
      })}
    </div>
  );
}