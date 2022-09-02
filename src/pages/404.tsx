import Logotype from '@/components/Logotype';
import { BaseMedia } from '@/components/Media/BaseMedia';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();
  return (
    <div className='custom404'>
      <div className='custom404__logotype-container'>
        <Logotype />
      </div>
      <h1 className='custom404__catchphrase'>You missed the mark</h1>
      <div className='custom404__404logo' onClick={() => router.push('/')}>
        <BaseMedia src='/branding/404.svg' />
      </div>
    </div>
  );
}
