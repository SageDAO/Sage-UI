import React from 'react';

function news() {
  return (
    <div className='news-page'>
      <h1 className='news-page__header'>
        NEWS FROM THE <br /> CRYPTO SPACE
      </h1>
      <h2 className='news-page__subheader'>
        FIND ALL THE LATEST NEWS AND ARTICLES <br /> ABOUT EVERYTHING NFTS AND CRYPTO
      </h2>
    </div>
  );
}

export function getStaticProps() {
  return {
    redirect: {
      destination: '/404',
      permanent: false,
    },
  };
}

export default news;
