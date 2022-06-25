import prisma from '@/prisma/client';
import React, { useEffect, useRef } from 'react';
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
  const cursorEl = useRef<HTMLDivElement | null>(null);
  const cursorDot = useRef<HTMLDivElement | null>(null);
  const cursorMedia = useRef<HTMLDivElement | null>(null);
  function handleOnMouseMoveHome(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // cursorEl.current?.setAttribute('data-x', dataX);
    // cursorEl.current?.setAttribute('data-y', dataY);
    // const cursorEl: HTMLDivElement = document.querySelector('[data-cy=cursor]')!;
    // cursorEl.current?.setAttribute('style', 'top:' + e.pageY + 'px; left:' + e.pageX + 'px;');
    // cursorEl.current?.setAttribute('style', `transform: translate3d(${dataX}, ${dataY}, 0px)`);
    // console.log(e.currentTarget);
  }

  useEffect(() => {
    document.querySelector('.home-page')?.addEventListener('mousemove', (e) => {
			//@ts-ignore
      const dataX = String(e.pageX - 20) + 'px';
			//@ts-ignore
      const dataY = String(e.pageY - 20) + 'px';
      cursorEl.current?.setAttribute('style', `transform: translate3d(${dataX}, ${dataY}, 0px)`);
    });
    document.querySelector('.home-page__sage-logo')?.addEventListener('mouseover', () => {
      cursorDot.current!.dataset.type = 'small';
    });
    document.querySelector('.home-page__sage-logo')?.addEventListener('mouseout', () => {
      cursorDot.current!.dataset.type = 'normal';
    });

    document.querySelectorAll('div.home-page__two-item')?.forEach((node, i: number) => {
      node.addEventListener('mouseenter', () => {
        cursorDot.current!.dataset.type = 'small';
        cursorMedia.current!.dataset.show = 'true';
        cursorMedia.current!.dataset.bg = String(i);
      });
    });
    document.querySelectorAll('div.home-page__two-item')?.forEach((node) => {
      node.addEventListener('mouseout', () => {
        cursorDot.current!.dataset.type = 'normal';
        cursorMedia.current!.dataset.show = 'false';
      });
    });

    document.querySelector('.cursor')?.addEventListener('mouseover', () => {});
  }, []);
  return (
    <div className='home-page' data-cy='home-page' onMouseMove={handleOnMouseMoveHome}>
      <div className='home-page__hero'>
        <div className='home-page__sage-logo'>Originalplan</div>

        <div ref={cursorEl} className='cursor' data-cy='cursor'>
          <div ref={cursorMedia} className='cursor__media'></div>
          <div ref={cursorDot} className='cursor__dot'></div>
        </div>
      </div>
      <section className='home-page__two'>
        <div className='home-page__two-item'>zero</div>
        <div className='home-page__two-item'>one</div>
        <div className='home-page__two-item'>two</div>
      </section>
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
