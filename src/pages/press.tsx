import { useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';

export default function press() {
  const mediumURL =
    'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dontbuymeme';
  const [isLoading, setIsLoading] = useState(true);
  const [feedImage, setFeedImage] = useState<string>('');
  const [feedLink, setFeedLink] = useState<string>('');
  const [feedItems, setFeedItems] = useState<any[]>();

  useEffect(() => {
    const fetchMediumPosts = async () => {
      const response = await fetch(mediumURL);
      const data = await response.json();
      setFeedImage(data.feed.image);
      setFeedLink(data.feed.link);
      // const items = data.items.filter((item: any) => item.categories.length > 0);
      setFeedItems(data.items);
      setIsLoading(false);
    };

    fetchMediumPosts();
  }, []);

  if (isLoading) {
    return (
      <div style={{ margin: '25px auto 25px' }}>
        <br />
        <Loader type='ThreeDots' color='white' height={10} width={50} timeout={0} />
      </div>
    );
  }
  return (
    <>
      <div style={{ margin: '25px auto 25px' }}>Feed</div>
      <br />
      <br />
      <pre style={{ whiteSpace: 'pre-wrap', width: '75%' }}>
        <img src={feedImage} width={100} />
        <br />
        <br />
        {feedItems?.map((item, i) => (
          <div key={i}>
            post: {JSON.stringify(item, undefined, 5)} <br />
          </div>
        ))}
      </pre>
    </>
  );
}
