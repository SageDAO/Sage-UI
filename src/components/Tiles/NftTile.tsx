import React from 'react';
import { BaseImage } from '../Image';
import { useRouter } from 'next/router';

interface Props {
  imgSrc: string;
  children?: JSX.Element;
  name: string;
  subtitle: string;
  button?: React.ReactElement;
  buttonText?: string;
  buttonAction?: () => any;
  imgLink: string;
}

function NftTile({ imgSrc, name, subtitle, button, imgLink, children }: Props) {
  const router = useRouter();
  function handleNftImageClick() {
    router.push(imgLink);
  }
  return (
    <div className='nft-tile'>
      <div className='image' onClick={handleNftImageClick}>
        <BaseImage src={imgSrc} />
      </div>
      <div className='nft-tile__interact'>
        <div className='nft-tile__interact-info'>
          <h1 className='nft-tile__interact-name'>{name}</h1>
          <h1 className='nft-tile__interact-subtitle'>{subtitle}</h1>
        </div>
        {button}
      </div>
      {children}
    </div>
  );
}

export default NftTile;
