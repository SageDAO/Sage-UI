import { BaseMedia } from '@/components/Media/BaseMedia';
import React, { useState } from 'react';
import ArrowLeftSVG from '@/public/interactive/arrow-left.svg';
import ArrowRightSVG from '@/public/interactive/arrow-right.svg';

interface Props {
  nfts: any[];
}

function Gallery({ nfts }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const firstIndex = selectedIndex;
  const secondIndex = firstIndex + 1;
  const thirdIndex = secondIndex + 1;

  function handleControlLeftClick() {
    if (selectedIndex == 0) return;
    setSelectedIndex((prev) => {
      return prev - 1;
    });
  }

  function handleControlRightClick() {
    if (selectedIndex + 1 >= nfts.length) return;
    setSelectedIndex((prev) => {
      return prev + 1;
    });
  }

  function handleGalleryGridItemClick(i: number) {
    if (i == selectedIndex) return;
    setSelectedIndex(i);
  }

  if (!nfts.length) return null;
  if (!nfts) return null;

  return (
    <>
      <div className='collection-panel__gallery-display'>
        <ArrowLeftSVG
          onClick={handleControlLeftClick}
          className='collection-panel__gallery-control-left'
        ></ArrowLeftSVG>
        <ArrowRightSVG
          onClick={handleControlRightClick}
          className='collection-panel__gallery-control-right'
        ></ArrowRightSVG>
        {nfts.map((nft, i: number) => {
          console.log(nft);
          let className: string = 'collection-panel__gallery-display-item';

          const isCurrent: boolean = selectedIndex == i;
          const isNext: boolean = selectedIndex == i - 1;
          const isNextTwo: boolean = selectedIndex == i - 2;

          if (isCurrent) {
            className = 'collection-panel__gallery-display-item--first';
          }
          if (isNext) {
            className = 'collection-panel__gallery-display-item--second';
          }
          if (isNextTwo) {
            className = 'collection-panel__gallery-display-item--third';
          }
          return (
            <div
              style={{
                aspectRatio: String(nft.width / nft.height),
                width: nft.width / 1.5,
                height: nft.height / 1.5,
              }}
              className={className}
            >
              <BaseMedia src={nft.s3PathOptimized}></BaseMedia>
            </div>
          );
        })}
      </div>
      <div className='collection-panel__tile-nft-info'>
        <p className='collection-panel__tile-nft-name'>{nfts[selectedIndex].nftName}</p>
        <p className='collection-panel__tile-artist-name'>
          BY {nfts[selectedIndex].artistUsername}
        </p>
      </div>
      <div className='collection-panel__gallery-grid'>
        {nfts.map((nft, i: number) => {
          return (
            <div
              key={nft.id}
              onClick={() => handleGalleryGridItemClick(i)}
              className='collection-panel__gallery-grid-item'
            >
              <BaseMedia src={nft.s3PathOptimized}></BaseMedia>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Gallery;
