import { useEffect, useState } from 'react';
import LoaderDots from '@/components/LoaderDots';

export default function press() {
  const mediumurl =
    'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dontbuymeme';
  const [isloading, setisloading] = usestate(true);
  const [feedimage, setfeedimage] = usestate<string>('');
  const [feedlink, setfeedlink] = usestate<string>('');
  const [feedtitle, setfeedtitle] = usestate<string>('');
  const [feeditems, setfeeditems] = usestate<any[]>();

  useeffect(() => {
    const fetchmediumposts = async () => {
      const response = await fetch(mediumurl);
      const data = await response.json();
      setfeedimage(data.feed.image);
      setfeedtitle(data.feed.title);
      setfeedlink(data.feed.link);
      setfeeditems(data.items);
      setisloading(false);
    };

    fetchmediumposts();
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
