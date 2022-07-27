import LoaderSpinner from '@/components/LoaderSpinner';
import { BaseMedia } from '@/components/Media';
import { MintRequest, useMintSingleNftMutation } from '@/store/nftsReducer';
import { Signer } from 'ethers';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSigner } from 'wagmi';

interface State {
  file: File | null;
  title: string;
  description: string;
  tags: string;
  price: string;
  preview: string;
}

const INITIAL_STATE: State = {
  file: null,
  title: '',
  description: '',
  tags: '',
  price: '',
  preview: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
};

export default function CreationsPanel() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [mintSingleNft, { isLoading: isMinting }] = useMintSingleNftMutation();
  const { data: signer } = useSigner();

  function handleTitleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return { ...prevState, title: e.target.value };
    });
  }

  function handlePriceInput(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return { ...prevState, price: e.target.value };
    });
  }

  function handleTagsInput(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return { ...prevState, tags: e.target.value };
    });
  }

  function handleDescriptionInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setState((prevState) => {
      return { ...prevState, description: e.target.value };
    });
  }

  function handleFilesInput(e: React.ChangeEvent<HTMLInputElement>) {
    const validTypes = ['image/png', 'image/gif', 'image/jpeg', 'video/mpeg'];
    const newFile = e.target.files![0];
    setState((prevState) => {
      return { ...prevState, file: validTypes.includes(newFile.type) ? newFile : null };
    });
  }

  async function handleMintButtonClick() {
    if (!signer) {
      toast.warn('Please Sign In With Ethereum before submitting your artwork');
      return;
    }
    if (!state.file) {
      toast.warn('Please select a valid file for uploading your artwork');
      return;
    }
    if (state.title.trim().length == 0) {
      toast.warn('Please type a title for your artwork');
      return;
    }
    const priceNum = parseFloat(state.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.warn('Please type a valid price for your artwork');
      return;
    }
    toast.info('Please sit back, this will take a couple of minutes!');
    const result = await mintSingleNft({
      name: state.title,
      description: state.description,
      tags: state.tags,
      price: parseFloat(state.price),
      file: state.file,
      signer: signer as Signer,
    } as MintRequest);
    const nftId = (result as any).data;
    if (!nftId || nftId == 0) {
      toast.error('Failure minting NFT');
    } else {
      toast.success(`Success! NFT minted!`);
    }
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
      <form className='creations-panel__form'>
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
            ADD AN ARTWORK ( WE SUPPORT JPG, PNG, GIF and MP4 )
          </h1>
        </div>
        <div className='creations-panel__file-title-group'>
          <h1 className='creations-panel__file-title-label'>artwork title *</h1>
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
        <div className='creations-panel__file-title-group'>
          <h1 className='creations-panel__file-title-label'>tags</h1>
          <input
            value={state.tags}
            onChange={handleTagsInput}
            className='creations-panel__file-title-field'
          />
        </div>
        <div className='creations-panel__file-title-group'>
          <h1 className='creations-panel__file-title-label'>artwork price (ash) *</h1>
          <input
            type='number'
            value={state.price}
            onChange={handlePriceInput}
            className='creations-panel__file-title-field'
          />
        </div>
        <button
          disabled={isMinting}
          className='creations-panel__submit-button'
          type='button'
          onClick={handleMintButtonClick}
        >
          {isMinting ? <LoaderSpinner /> : `mint artwork`}
        </button>
      </form>

      {/*
      <div className='creations-panel__manage'>
        <h1 className='creations-panel__manage-header'>
          manage creations
          <h1 className='creations-panel__manage-subheader'>group, send, burn your creations</h1>
        </h1>
      </div>
      */}
    </div>
  );
}