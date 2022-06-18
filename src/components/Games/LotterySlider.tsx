import { Nft } from '@/prisma/types';
import { Dispatch, SetStateAction } from 'react';
import { BaseMedia } from '@/components/Media';

interface Props {
  nfts: Nft[];
  selectedNftIndex: number;
  setSelectedNftIndex: Dispatch<SetStateAction<number>>;
}

// src/styles/components/_lottery-slider.scss
export default function LotterySlider({ nfts, selectedNftIndex, setSelectedNftIndex }: Props) {
  return (
    <div className='lottery-slider'>
      <div className='lottery-slider__header'>
        <h1 className='lottery-slider__header-label'>NFTs</h1>
        <div className='lottery-slider__header-nft-count'>{nfts.length}</div>
      </div>
      <div className='lottery-slider__slider'>
        {nfts.map((nft: Nft, i: number) => {
          function handleSliderItemClick() {
            setSelectedNftIndex(i);
          }
          return (
            <div
              className='lottery-slider__slider-item'
              key={nft.id}
              onClick={handleSliderItemClick}
              data-selected={selectedNftIndex === i}
            >
              NFT{nft.id}
              <BaseMedia src={nft.s3Path} isVideo={nft.isVideo} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
