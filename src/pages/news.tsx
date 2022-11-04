import Logotype from '@/components/Logotype';
import TwitterSVG from '@/public/socials/twitter.svg';
import LinkSVG from '@/public/socials/link.svg';
import { getSageMediumData } from '@/prisma/functions';
import { parseHTMLStrings } from '@/utilities/strings';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import React from 'react';
import NewsArticle from '@/components/NewsArticle';

interface Props {
  mediumData: any;
}

function news({ mediumData }: Props) {
  return (
    <div className='news-page'>
      <Logotype></Logotype>
      <h1 className='news-page__header'>
        NEWS FROM THE <br /> CRYPTO SPACE
      </h1>
      <h2 className='news-page__subheader'>
        FIND ALL THE LATEST NEWS AND ARTICLES <br /> ABOUT EVERYTHING NFTS AND CRYPTO
      </h2>
      <section className='news-page__main'>
        <div className='news-page__featured-news'>
          {mediumData.items?.map((item, i: number) => {
            return <NewsArticle {...item} highlight={Boolean(i == 0)} />;
          })}
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const mediumData = await getSageMediumData();
  // return {
  //   redirect: {
  //     destination: '/404',
  //     permanent: false,
  //   },
  // };
  return {
    props: { mediumData },
    revalidate: 300,
  };
};

export default news;
