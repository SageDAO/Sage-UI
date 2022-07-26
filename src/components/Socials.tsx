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
      <Discord className='socials__icon' />
      <Twitter className='socials__icon' />
      <Medium className='socials__icon' />
      <Uniswap className='socials__icon' />
      <Opensea className='socials__icon' />
      <CMU className='socials__icon' />
    </div>
  );
}
