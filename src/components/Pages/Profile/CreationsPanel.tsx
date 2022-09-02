import React, { Fragment } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSigner } from 'wagmi';
import { Signer } from 'ethers';
import LoaderSpinner from '@/components/LoaderSpinner';
import { MintRequest, useMintSingleNftMutation } from '@/store/nftsReducer';
import { animated, Spring } from 'react-spring';
import FileInputWithPreview from '@/components/FileInputWithPreview';

interface State {
  file: File | null;
  title: string;
  description: string;
  tags: string;
  price: string;
  isFixedPrice: boolean;
}

const INITIAL_STATE: State = {
  file: null,
  title: '',
  description: '',
  tags: '',
  price: '',
  isFixedPrice: true,
};

export default function CreationsPanel() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [mintSingleNft, { isLoading: isMinting }] = useMintSingleNftMutation();
  const { data: signer } = useSigner();

  function handleTitleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return { ...prevState, title: e.target.value };
    });
  }

  function handlePriceInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return { ...prevState, price: e.target.value };
    });
  }

  function handlePriceTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setState((prevState) => {
      return { ...prevState, isFixedPrice: 'true' == e.target.value };
    });
  }

  function handleTagsInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return { ...prevState, tags: e.target.value };
    });
  }

  function handleDescriptionInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setState((prevState) => {
      return { ...prevState, description: e.target.value };
    });
  }

  function handleFileInputChange(file: File | null) {
    setState((prevState) => {
      return { ...prevState, file };
    });
  }

  async function handleMintButtonClick() {
    if (!signer) {
      toast.info('Please sign in with a wallet.');
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
    toast.info('Please sit back, this might take a minute or so!');
    const result = await mintSingleNft({
      name: state.title,
      description: state.description,
      tags: state.tags,
      price: parseFloat(state.price),
      isFixedPrice: state.isFixedPrice,
      file: state.file,
      signer: signer as Signer,
    } as MintRequest);
    const nftId = parseInt((result as any).data);
    if (isNaN(nftId) || nftId == 0) {
      toast.error('Failure minting NFT');
    } else {
      toast.success(`Success! NFT minted!`);
    }
  }

  return (
    <Fragment>
      <Spring to={{ translateX: 0 }} from={{ translateX: -100 }}>
        {(styles) => {
          return (
            <animated.h1 style={styles} className='profile-page__tabs-panel-header'>
              creations panel
              <span className='profile-page__tabs-panel-subheader'>edit your sage profile</span>
            </animated.h1>
          );
        }}
      </Spring>
      <Spring to={{ translateX: 0 }} from={{ translateX: -100 }}>
        {(styles) => {
          return (
            <animated.div style={styles} className='creations-panel'>
              <form className='creations-panel__form'>
                <div className='creations-panel__file-upload-group'>
                  <FileInputWithPreview onFileChange={handleFileInputChange} />
                  <h1 className='creations-panel__file-upload-label'>
                    ADD AN ARTWORK ( WE SUPPORT JPG, PNG, GIF and MP4 )
                  </h1>
                </div>
                <div className='creations-panel__file-title-group'>
                  <h1 className='creations-panel__file-title-label'>artwork title *</h1>
                  <input
                    value={state.title}
                    onChange={handleTitleInputChange}
                    className='creations-panel__file-title-field'
                  />
                </div>
                <div className='creations-panel__file-desc-group'>
                  <h1 className='creations-panel__file-desc-label'>artwork description</h1>
                  <textarea
                    value={state.description}
                    onChange={handleDescriptionInputChange}
                    className='creations-panel__file-desc-field'
                    maxLength={500}
                  />
                </div>
                <div className='creations-panel__file-title-group'>
                  <h1 className='creations-panel__file-title-label'>tags</h1>
                  <input
                    value={state.tags}
                    onChange={handleTagsInputChange}
                    className='creations-panel__file-title-field'
                  />
                </div>
                <div className='creations-panel__file-title-group'>
                  <h1 className='creations-panel__file-title-label'>pricing type *</h1>
                  <select
                    onChange={handlePriceTypeChange}
                    className='creations-panel__file-title-field'
                  >
                    <option value='true'>fixed price</option>
                    <option value='false'>minimum price</option>
                  </select>
                </div>
                <div className='creations-panel__file-title-group'>
                  <h1 className='creations-panel__file-title-label'>artwork price (ash) *</h1>
                  <input
                    type='number'
                    value={state.price}
                    onChange={handlePriceInputChange}
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
            </animated.div>
          );
        }}
      </Spring>
    </Fragment>
  );
}