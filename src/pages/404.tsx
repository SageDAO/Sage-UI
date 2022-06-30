import { BaseMedia } from '@/components/Media';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();
  return (
    <div className='custom404 page'>
      <div className='custom404__logotype'>
        <BaseMedia src='/branding/sage-logotype.svg' isVideo={false} />
      </div>
      <h1 className='custom404__catchphrase'>You missed the mark</h1>
      <div className='custom404__404logo' onClick={() => router.push('/')}>
        <BaseMedia src='/branding/404.svg' isVideo={false} />
      </div>
    </div>
  );
}
