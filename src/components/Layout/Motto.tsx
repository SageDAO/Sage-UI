import MottoSVG from '@/public/branding/motto.svg';
import SageIconSVG from '@/public/branding/sage-icon.svg';
import React from 'react';

export default function DestroyingFakes() {
  return (
    <div className='sage-logotype__side'>
      <MottoSVG className='sage-logotype__motto' />
      <SageIconSVG className='sage-logotype__sage-icon' />
    </div>
  );
}
