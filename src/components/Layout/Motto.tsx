import React from 'react';

interface Props {
  dataColor?: string;
}

export default function Motto({ dataColor }: Props) {
  return (
    <div className='motto'>
      SAGE<sup>™</sup>️ - ACCELERATING WEB 3
    </div>
  );
}
