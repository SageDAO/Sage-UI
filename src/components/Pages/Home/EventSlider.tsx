import NewsArticle from '@/components/NewsArticle';
import useSageRoutes from '@/hooks/useSageRoutes';
import { parseHTMLStrings } from '@/utilities/strings';
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
      <p className='home-page__events-subheader'>Latest news from SAGE</p>
      <div className='home-page__events'>
        {state.items.map((item, i) => {
          return <NewsArticle key={i} {...item} />;
        })}
      </div>
      <div className='home-page__events-section-bottom'>
        <button onClick={pushToNews} className='home-page__events-visit-button'>
          VISIT ALL NEWS
        </button>
      </div>
    </section>
  );
}
