import { BaseMedia } from '@/components/Media';
import { Lottery_include_Nft } from '@/prisma/types';

interface Props {
  lottery: Lottery_include_Nft;
}
export default function LotteryThumbnail({ lottery }: Props) {
  return (
    <div
      style={{ gridTemplateColumns: `repeat(${lottery.Nfts.length - 1} ,1fr)` }}
      className='lottery-thumbnail'
    >
      {lottery.Nfts.map((nft) => {
        return (
            <div
              key={nft.id}
              data-item={`lottery-nft-${nft.id}`}
              className='lottery-thumbnail__item'
            >
              <BaseMedia src={nft.s3Path}></BaseMedia>
            </div>
        );
      })}
    </div>
  );
}
