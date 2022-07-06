import { useEffect, useState } from 'react';
import LoaderDots from '@/components/LoaderDots';

export default function press() {
  const mediumURL =
    'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dontbuymeme';
  const [isLoading, setIsLoading] = useState(true);
  const [feedImage, setFeedImage] = useState<string>('');
  const [feedLink, setFeedLink] = useState<string>('');
  const [feedTitle, setFeedTitle] = useState<string>('');
  const [feedItems, setFeedItems] = useState<any[]>();

  useEffect(() => {
    const fetchMediumPosts = async () => {
      const response = await fetch(mediumURL);
      const data = await response.json();
      setFeedImage(data.feed.image);
      setFeedTitle(data.feed.title);
      setFeedLink(data.feed.link);
      setFeedItems(data.items);
      setIsLoading(false);
    };

    fetchMediumPosts();
  }, []);

  if (isLoading) {
    return <LoaderDots />;
  }
  return (
    <div className='home-page page'>
      <a href={feedLink} target='_blank'>
        <img src={feedImage} width={75} />
      </a>
      <span
        style={{ marginTop: '10px' }}
        dangerouslySetInnerHTML={{ __html: htmlDecode(feedTitle) as string }}
      />
      {feedItems?.map((item, i) => (
        <MediumPost post={item} key={i} />
      ))}
    </div>
  );
}

// properties: title, pubDate, link, guid, author, thumbnail, description, content, enclosure, categories
function MediumPost({ post }: any) {
  return (
    <div style={{ marginTop: '20px', width: '75%' }}>
      <span style={{ fontSize: '10px' }}>{post.pubDate}</span>
      <br />
      <span style={{ fontWeight: 'bold', fontSize: '20px', textTransform: 'uppercase' }}>
        {post.title}
      </span>
      &nbsp; <span style={{ fontWeight: 'lighter', fontSize: '12px' }}>by {post.author}</span>
      <br />
      <span
        style={{ marginTop: '10px' }}
        dangerouslySetInnerHTML={{ __html: (post.content as string).replaceAll('\n', '<br/>') }}
      />
      <hr />
    </div>
  );
}

const htmlDecode = (input: string) => {
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
};
