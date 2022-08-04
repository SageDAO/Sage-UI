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

const mediumURL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@niharikasodhi';

const fetchMediumPosts = async (callback: (data: any) => void) => {
  const response = await fetch(mediumURL);
  const data = await response.json();
  callback(data);
};
export default function EventSlider() {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    fetchMediumPosts((data) => {
      if (data && data.feed) {
        setState((prevState) => {
          return {
            ...prevState,
            image: data.feed.image,
            title: data.feed.title,
            link: data.feed.link,
            items: data.items,
            description: data.feed.description,
          };
        });
      }
    });
  }, []);

  if (!state.items) return null;

  return (
    <div className='home-page__events'>
      {state.items.map((item, i: number) => {
        return (
          <a target='__blank' key={i} className='home-page__event-slide' href={item.link}>
            <h1 className='home-page__event-slide-header'>news</h1>
            <Image
              src={item.thumbnail}
              layout='fill'
              objectFit='cover'
              loader={({ src, width, quality }) => {
                return `${src}?w=${width}&q=${quality || 75}`;
              }}
            />
            <div className='home-page__event-slide-focus' />
            <div className='home-page__event-slide-content'>
              <h1 className='home-page__event-slide-content-title'>{item.title}</h1>
              <div className='home-page__event-slide-content-group'>
                <p className='home-page__event-slide-content-description'>{item.pubDate}</p>
                <button className='home-page__event-slide-content-read-more-button'>
                  read more
                </button>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
