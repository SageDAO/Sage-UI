import Image from 'next/image';
import { useEffect, useState } from 'react';

interface State {
  image: string;
  title: string;
  link: string;
  description: string;
  items: any[];
}

const INITIAL_STATE: State = { image: '/', title: '', link: '', items: [], description: '' };

interface Props {
  mediumData: any;
}

export default function EventSlider({ mediumData }: Props) {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    setState((prevState) => {
      return {
        ...prevState,
        image: mediumData.feed.image,
        title: mediumData.feed.title,
        link: mediumData.feed.link,
        items: mediumData.items,
        description: mediumData.feed.description,
      };
    });
  }, []);

  if (!state.items) return null;

  return (
    <section className='home-page__events-section'>
      <h3 className='home-page__events-header'>news</h3>
      <div className='home-page__events'>
        <a target='__blank' className='home-page__events-main' href={state.items[0]?.link}>
          <div className='home-page__events-main-media'>
            <Image
              src={state.items[0]?.thumbnail}
              layout='fill'
              objectFit='cover'
              className='home-page__events-slide-bg'
              loader={({ src, width, quality }) => {
                return `${src}?w=${width}&q=${quality || 75}`;
              }}
            />
          </div>
          <div className='home-page__event-slide-content'>
            <h1 className='home-page__event-slide-content-title'>{state.items[0]?.title}</h1>
          </div>
        </a>
        <div className='home-page__events-secondary'>
          <>
            <div className='home-page__events-secondary-item'>
              <div className='home-page__events-secondary-item-media'>
                <Image src={'/sample/geo.png'} layout='fill'></Image>
              </div>
              <p className='home-page__events-secondary-item-title'>new geometrics style guide</p>
            </div>
            <div className='home-page__events-secondary-item'>
              <div className='home-page__events-secondary-item-media'>
                <Image src={'/sample/court.png'} layout='fill'></Image>
              </div>
              <p className='home-page__events-secondary-item-title'>courtside with teddy kelly</p>
            </div>
            <div className='home-page__events-secondary-item'>
              <div className='home-page__events-secondary-item-media'>
                <Image src={'/sample/trends.png'} layout='fill'></Image>
              </div>
              <p className='home-page__events-secondary-item-title'>2023 crypto art trends</p>
            </div>
            <div className='home-page__events-secondary-item'>
              <div className='home-page__events-secondary-item-media'>
                <Image src={'/sample/datamatics.png'} layout='fill'></Image>
              </div>
              <p className='home-page__events-secondary-item-title'>ryoji ikeda - datamatics</p>
            </div>
          </>
          <button className='home-page__events-visit-news-button'>visit news page</button>
        </div>
      </div>
    </section>
  );
}
