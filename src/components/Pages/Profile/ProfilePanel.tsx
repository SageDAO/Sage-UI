import { PfpImage } from '@/components/Media';
import { useGetUserQuery } from '@/store/usersReducer';
import { useState, useEffect } from 'react';

import { useUpdateUserMutation } from '@/store/usersReducer';
import type { SafeUserUpdate } from '@/prisma/types';
import useModal from '@/hooks/useModal';
import ProfilePictureModal from '@/components/Modals/ProfilePictureModal';

interface State extends SafeUserUpdate {}

const INITIAL_STATE: State = {
  displayName: '',
  profilePicture: '',
  bio: '',
  webpage: '',
  twitterUsername: '',
  instagramUsername: '',
  mediumUsername: '',
};

export default function ProfilePanel() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { data } = useGetUserQuery();
  const {
    isOpen: isProfilePicModalOpen,
    closeModal: closeProfilePicModal,
    openModal: openProfilePicModal,
  } = useModal();

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateUser(state);
  }

  function handleBioInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setState((prevState) => {
      return { ...prevState, bio: e.target.value };
    });
  }

  useEffect(() => {
    setState((prevState) => {
      return { ...data };
    });
  }, [data]);
  return (
    <form onSubmit={handleFormSubmit} className='profile-panel'>
      <ProfilePictureModal
        isOpen={isProfilePicModalOpen}
        closeModal={closeProfilePicModal}
        title='Profile Picture'
      />
      <div className='profile-panel__pfp-group'>
        <div className='profile-panel__pfp-container'>
          <a onClick={openProfilePicModal}>
            <PfpImage src={state?.profilePicture}></PfpImage>
          </a>
        </div>
        <h2 className='profile-panel__pfp-label'>add a profile picture</h2>
      </div>
      <div className='profile-panel__personal-group'>
        <h2 className='profile-panel__personal-label'>sage display name</h2>
        <input
          type='text'
          value={state?.displayName ?? ''}
          onChange={(e) => {
            setState((prevState) => {
              return { ...prevState, displayName: e.target.value };
            });
          }}
          className='profile-panel__personal-field'
        />
      </div>
      <div className='profile-panel__socials-group'>
        <h2 className='profile-panel__socials-label'>add up to 4 social profiles</h2>
        <div className='profile-panel__socials-field-container'>
          <input
            type='text'
            value={state.twitterUsername ?? ''}
            className='profile-panel__socials-field'
            onChange={(e) => {
              setState((prevState) => {
                return { ...prevState, twitterUsername: e.target.value };
              });
            }}
            placeholder='twitter'
          />
          <input
            type='text'
            value={state.instagramUsername ?? ''}
            className='profile-panel__socials-field'
            onChange={(e) => {
              setState((prevState) => {
                return { ...prevState, instagramUsername: e.target.value };
              });
            }}
            placeholder='instagram'
          />
          <input
            type='text'
            value={state.mediumUsername ?? ''}
            className='profile-panel__socials-field'
            onChange={(e) => {
              setState((prevState) => {
                return { ...prevState, mediumUsername: e.target.value };
              });
            }}
            placeholder='medium'
          />
          <input
            type='text'
            value={state.webpage ?? ''}
            className='profile-panel__socials-field'
            onChange={(e) => {
              setState((prevState) => {
                return { ...prevState, webpage: e.target.value };
              });
            }}
            placeholder='webpage'
          />
        </div>
      </div>
      <div className='profile-panel__bio-group'>
        <h2 className='profile-panel__bio-label'>about section, max 400 characters</h2>
        <textarea
          value={(state.bio as string) || ''}
          onChange={handleBioInput}
          className='profile-panel__bio-field'
        />
      </div>
      <button disabled={isLoading} type='submit' className='profile-panel__save-button'>
        save your changes
      </button>
    </form>
  );
}