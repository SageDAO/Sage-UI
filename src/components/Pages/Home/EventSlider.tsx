import useSageRoutes from '@/hooks/useSageRoutes';
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

function formatDescription() {}

export default function EventSlider({ mediumData }: Props) {
  const [state, setState] = useState(INITIAL_STATE);
  const { pushToNews } = useSageRoutes();

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
      <p className='home-page__events-subheader'>Latest news from the crypto space.</p>
      <div className='home-page__events'>
        {state.items.map((item, i) => {
          const regex = /(<([^>]+)>)/gi;
          let description = item.description.replace(regex, '');
          description = description.slice(0, 300);
          return (
            <a key={i} target='__blank' className='home-page__events-item' href={item.link}>
              <div className='home-page__events-item-media'>
                <Image
                  src={item.thumbnail}
                  layout='fill'
                  objectFit='cover'
                  className='home-page__events-slide-bg'
                  loader={({ src, width, quality }) => {
                    return `${src}?w=${width}&q=${quality || 75}`;
                  }}
                />
              </div>
              <div className='home-page__event-slide-content'>
                <p className='home-page__event-slide-content-title'>{item.title}</p>
                <p className='home-page__event-slide-content-description'>{description}</p>
              </div>
            </a>
          );
        })}
      </div>
      <div className='home-page__events-section-bottom'>
        <button disabled onClick={pushToNews} className='home-page__events-visit-button'>
          COMING SOON
        </button>
      </div>
    </section>
  );
}
