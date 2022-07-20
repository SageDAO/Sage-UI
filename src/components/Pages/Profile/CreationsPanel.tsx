import { BaseMedia } from '@/components/Media';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface State {
  file: File | null;
  title: string;
  description: string;
  preview: string;
}

const INITIAL_STATE: State = {
  file: null,
  title: '',
  description: '',
  preview: '/',
};

export default function CreationsPanel() {
  const [state, setState] = useState<State>(INITIAL_STATE);

  function handleTitleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return { ...prevState, title: e.target.value };
    });
  }

  function handleDescriptionInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setState((prevState) => {
      return { ...prevState, description: e.target.value};
    });
  }

  function handleFilesInput(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return { ...prevState, file: e.target.files![0] };
    });
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success('minted');
  }

  useEffect(() => {
    if (state.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState((prevState) => {
          return { ...prevState, preview: reader.result as string };
        });
      };
      reader.readAsDataURL(state.file);
    } else {
      setState((prevState) => {
        return { ...prevState, preview: INITIAL_STATE.preview };
      });
    }
  }, [state.file]);

  return (
    <div className='creations-panel'>
      <form onSubmit={handleFormSubmit} className='creations-panel__form'>
        <div className='creations-panel__file-upload-group'>
          <div className='creations-panel__file-upload-field-wrapper'>
            <input
              onChange={handleFilesInput}
              type='file'
              className='creations-panel__file-upload-field'
              accept='image/png, image/gif, image/jpeg, video/mp4'
            ></input>
            <Image
              className='creations-panel__file-upload-plus-icon '
              src='/icons/plus.svg'
              width={40}
              height={40}
            ></Image>
            <BaseMedia
              type={state.file?.type}
              src={state.preview}
              isVideo={state.file?.type.includes('video')}
            ></BaseMedia>
          </div>
          <h1 className='creations-panel__file-upload-label'>
            ADD AN ARTWORK ( WE SUPPORT JPG, PNG, GIF, MP4 )
          </h1>
        </div>
        <div className='creations-panel__file-title-group'>
          <h1 className='creations-panel__file-title-label'>artwork title</h1>
          <input
            value={state.title}
            onChange={handleTitleInput}
            className='creations-panel__file-title-field'
          />
        </div>
        <div className='creations-panel__file-desc-group'>
          <h1 className='creations-panel__file-desc-label'>artwork description</h1>
          <textarea
            value={state.description}
            onChange={handleDescriptionInput}
            className='creations-panel__file-desc-field'
          />
        </div>
        <button disabled className='creations-panel__submit-button' type='submit'>
          mint artwork
        </button>
      </form>
      <div className='creations-panel__manage'>
        <h1 className='creations-panel__manage-header'>
          manage creations
          <h1 className='creations-panel__manage-subheader'>group, send, burn your creations</h1>
        </h1>
      </div>
    </div>
  );
}
