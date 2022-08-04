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
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dontbuymeme';

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
            items: data.feed.items,
            description: data.feed.description,
          };
        });
      }
    });
  }, []);

  if (state.title == '') {
    return null;
  }

  return (
    <div className='home-page__events'>
      <a target='__blank' className='home-page__event-slide' href={state.link}>
        <h1 className='home-page__event-slide-header'>
          news 
        </h1>
        <Image
          src={state.image}
          layout='fill'
          objectFit='cover'
          loader={({ src, width, quality }) => {
            return `${src}?w=${width}&q=${quality || 75}`;
          }}
        />
        <div className='home-page__event-slide-focus' />
        <div className='home-page__event-slide-content'>
          <h1 className='home-page__event-slide-content-title'>{state.title}</h1>
          <div className='home-page__event-slide-content-group'>
            <p className='home-page__event-slide-content-description'>{state.description}</p>
            <button className='home-page__event-slide-content-read-more-button'>read more</button>
          </div>
        </div>
      </a>
    </div>
  );
}
