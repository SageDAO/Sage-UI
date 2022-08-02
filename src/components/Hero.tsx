import { useRouter } from 'next/router';
import Logotype from '@/components/Logotype';
import { BaseMedia } from '@/components/Media';
import { animated, useSpring } from 'react-spring';

interface Props {
  imgSrc: string;
  path?: string;
}

export default function Hero({ imgSrc, path }: Props) {
  const router = useRouter();
  const stylesLogotype = useSpring({
    from: { translateX: 100 },
    to: { translateX: 0 },
    duration: 200,
    delay: 200,
  });
  const stylesBanner = useSpring({
    from: { translateX: -100 },
    to: { translateX: 0 },
    config: { duration: 200 },
  });
  return (
    <div className='hero'>
      <animated.div style={stylesLogotype} className='hero__logotype-container'>
        <Logotype></Logotype>
      </animated.div>
      <animated.div style={stylesBanner} className='hero__banner'>
        <BaseMedia
          onClickHandler={async () => {
            if (!path) return;
            await router.push(path);
          }}
          src={imgSrc}
          isVideo={false}
        ></BaseMedia>
      </animated.div>
    </div>
  );
}
