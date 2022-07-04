import React from 'react';
import useDropDown from '@/hooks/useDropDown';

function drops() {
  const { currentOption, setCurrentOption } = useDropDown(['Most Recent']);
  return <div className='drops-page page'></div>;
}

export default drops;
