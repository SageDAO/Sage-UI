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
      <h3 className='home-page__event-slide-header'>news</h3>
      <div className='home-page__events'>
        {state.items.map((item, i: number) => {
          return (
            <>
              <a target='__blank' key={i} className='home-page__event-slide' href={item.link}>
                <Image
                  src={item.thumbnail}
                  layout='fill'
                  objectFit='cover'
                  className='home-page__events-slide-bg'
                  loader={({ src, width, quality }) => {
                    return `${src}?w=${width}&q=${quality || 75}`;
                  }}
                />
                <h3 className='home-page__event-slide-header'></h3>
                <div className='home-page__events-slide-middle'>
                  <Image
                    src={item.thumbnail}
                    layout='fill'
                    objectFit='cover'
                    className=''
                    loader={({ src, width, quality }) => {
                      return `${src}?w=${width}&q=${quality || 75}`;
                    }}
                  />
                </div>

                <div className='home-page__event-slide-content'>
                  <h1 className='home-page__event-slide-content-title'>{item.title}</h1>
                  <div className='home-page__event-slide-content-group'>
                    <button className='home-page__event-slide-content-read-more-button'>
                      read more
                    </button>
                  </div>
                </div>
              </a>
            </>
          );
        })}
      </div>
    </section>
  );
}
