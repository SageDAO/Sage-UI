import prisma from '@/prisma/client';
import React from 'react';
// Import carousel css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

import { Drop_include_GamesAndArtist } from '@/prisma/types';
import Drop from '@/components/Drop';

interface BannerType {
  imagePath: string;
  link: string;
}

function createBanner(imagePath: string, link: string): BannerType {
  return { imagePath, link };
}

const banners: BannerType[] = [createBanner('/pak.svg', '/')];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  adaptiveHeight: true,
  slidesToShow: 1,
  autoplay: true,
  arrows: false,
  slidesToScroll: 1,
};

interface Props {
  drops: Drop_include_GamesAndArtist[];
}

function home({ drops }: Props) {
  return (
    <div className='home-page' data-cy='home-page'>
      <Slider {...sliderSettings} className='banner-slider'>
        {banners.map((b) => {
          const src = `/sample/banners${b.imagePath}`;
          return (
            <a key={b.imagePath} href={b.link} target='_blank'>
              <img className='banner-image' src={src} />
            </a>
          );
        })}
      </Slider>
      <h1 className='home-page__subheader'>Available Drops</h1>
      <div className='home-page__featured-drops' data-cy='featured-drops'>
        {drops.map((d: Drop_include_GamesAndArtist) => {
          return <Drop drop={d} key={d.id} />;
        })}
      </div>
      {
        // <div className='home-page__explore-all'>
        //   <Link href='/drops'>
        //     <button className='home-page__explore-all-button'>Explore all drops</button>
        //   </Link>
        // </div>
      }
    </div>
  );
}

export async function getStaticProps() {
  let drops: Drop_include_GamesAndArtist[] = await prisma.drop.findMany({
    where: { approvedAt: { not: null } },
    include: {
      Artist: true,
      Lotteries: { include: { Nfts: true } },
      Auctions: { include: { Nft: true } },
    },
  });

  return {
    props: {
      drops: drops,
    },
    revalidate: 60,
  };
}

export default home;
