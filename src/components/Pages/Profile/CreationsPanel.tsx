import Image from 'next/image';
import { useState } from 'react';

interface State {
  file: any;
  title: string;
  description: string;
}

const INITIAL_STATE: State = {
  file: null,
  title: '',
  description: '',
};

export default function CreationsPaneli() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  return (
    <form className='creations-panel'>
      <div className='creations-panel__file-upload-group'>
        <div className='creations-panel__file-upload-field-wrapper'>
          <input type='file' className='creations-panel__file-upload-field'></input>
          <Image className='creations-panel__file-upload-plus-icon ' src='/icons/plus.svg' width={40} height={40}></Image>
        </div>
        <h1 className='creations-panel__file-upload-label'>
          ADD AN ARTWORK ( WE SUPPORT JPG,TIFF, GIF, MP4, MOV )
        </h1>
      </div>
      <div className='creations-panel__file-title-group'>
        <h1 className='creations-panel__file-title-label'>artwork title</h1>
        <input className='creations-panel__file-title-field' />
      </div>
      <div className='creations-panel__file-desc-group'>
        <h1 className='creations-panel__file-desc-label'>artwork description</h1>
        <textarea className='creations-panel__file-desc-field' />
      </div>
    </form>
  );
}
