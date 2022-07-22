import Image from 'next/image';
import { BaseMedia } from './Media';

export default function Logotype() {
  return (
    <div className='sage-logotype'>
      <img
        className='sage-logotype__destroying-fakes'
        draggable={false}
        src='/branding/destroying-fakes.svg'
      ></img>
      <Image src='/branding/sage-logotype.svg' layout='fill' className='sage-logotype__src' />
    </div>
  );
}
