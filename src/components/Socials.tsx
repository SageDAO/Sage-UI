import Discord from '@/public/socials/discord.svg';
import Twitter from '@/public/socials/twitter.svg';
import Medium from '@/public/socials/medium.svg';
import Opensea from '@/public/socials/opensea.svg';
import Uniswap from '@/public/socials/uniswap.svg';
import CMU from '@/public/socials/cmu.svg';

import React from 'react';

interface SocialLink {
  icon: any;
  link: string;
}

export default function Socials() {
  return (
    <div className='socials'>
      <a target='_blank' href='https://discord.com'><Discord className='socials__icon' /></a>
      <a target='_blank' href='https://twitter.com'><Twitter className='socials__icon' /></a>
      <a target='_blank' href='https://medium.com/@SAGE_ART'><Medium className='socials__icon' /></a>
      <a target='_blank' href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x64d91f12ece7362f91a6f8e7940cd55f05060b92&chain=mainnet'><Uniswap className='socials__icon' /></a>
      {/* <a target='_blank' href=''><Opensea className='socials__icon' /></a> */}
      <a target='_blank' href='https://coinmarketcap.com/currencies/ash/'><CMU className='socials__icon' /></a>
    </div>
  );
}
