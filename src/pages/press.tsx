import { useEffect, useState } from 'react';
import LoaderDots from '@/components/LoaderDots';

export default function press() {
  return <div className='home-page page'></div>;
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
