import { Nft } from '@/prisma/types';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { BaseMedia } from '@/components/Media';
import Image from 'next/image';

interface Props {
  nfts: Nft[];
  selectedNftIndex: number;
  setSelectedNftIndex: Dispatch<SetStateAction<number>>;
}

// src/styles/components/_lottery-slider.scss
export default function LotterySlider({ nfts, selectedNftIndex, setSelectedNftIndex }: Props) {
  const refs = nfts.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});

  const handleRightArrowClick = () => {
    console.log(selectedNftIndex);
    console.log(nfts.length);
    if (selectedNftIndex + 1 >= nfts.length) return;
    setSelectedNftIndex((prev) => prev + 1);
  };

  const handleLeftArrowClick = () => {
    if (selectedNftIndex - 1 < 0) return;
    setSelectedNftIndex((prev) => prev - 1);
  };

  useEffect(() => {
    console.log('useEffect()');
    const nftId = nfts[selectedNftIndex].id;
    refs[nftId].current.scrollIntoView({ behavior: 'smooth', alignToTop: false });
  }, [handleRightArrowClick, handleLeftArrowClick]);

  return (
    <div className='lottery-slider'>
      {nfts.map((nft: Nft, i: number) => {
        return (
          <div
            className='lottery-slider__slider-item'
            key={nft.id}
            ref={refs[nft.id]}
            data-selected={selectedNftIndex === i}
          >
            NFT{nft.id}
            <BaseMedia src={nft.s3Path} isVideo={nft.isVideo} />
          </div>
        );
      })}
      <div onClick={handleLeftArrowClick} className='lottery-slider__left'>
        <Image src='/interactive/arrow-left.svg' width={30} height={30}></Image>
      </div>
      <div onClick={handleRightArrowClick} className='lottery-slider__right'>
        <Image src='/interactive/arrow-right.svg' width={30} height={30}></Image>
      </div>
    </div>
  );
}
