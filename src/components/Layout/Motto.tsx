import MottoSVG from '@/public/branding/motto.svg';
import SageIconSVG from '@/public/branding/sage-icon.svg';
import React from 'react';

interface Props {
  dataColor?: string;
}

export default function DestroyingFakes({ dataColor }: Props) {
  return (
    <div className='sage-logotype__side'>
      <MottoSVG data-color={dataColor} className='sage-logotype__motto' />
      <SageIconSVG data-color={dataColor} className='sage-logotype__sage-icon' />
    </div>
  );
}
