import { PfpImage } from '@/components/Media';
import { useGetUserQuery } from '@/store/usersReducer';
import { User } from '@prisma/client';
import { useState, useEffect } from 'react';

import { useUpdateUserMutation } from '@/store/usersReducer';
import type { SafeUserUpdate } from '@/prisma/types';

interface State extends SafeUserUpdate {}

const INITIAL_STATE: State = {
  displayName: '',
  profilePicture: '',
  bio: '',
  webpage: '',
  twitterLink: '',
  instagramLink: '',
  mediumLink: '',
};

export default function ProfilePanel() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [updateUser] = useUpdateUserMutation();
  const { data } = useGetUserQuery();

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
      <div className='profile-panel__pfp-group'>
        <div className='profile-panel__pfp-container'>
          <PfpImage src={state?.profilePicture}></PfpImage>
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
              return { ...prevState, displayName: e.target.value.trim() };
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
            value={state.twitterLink ?? ''}
            className='profile-panel__socials-field'
            onChange={(e) => {
              setState((prevState) => {
                return { ...prevState, twitterLink: e.target.value.trim() };
              });
            }}
            placeholder='twitter'
          />
          <input
            type='text'
            value={state.instagramLink ?? ''}
            className='profile-panel__socials-field'
            onChange={(e) => {
              setState((prevState) => {
                return { ...prevState, instagramLink: e.target.value.trim() };
              });
            }}
            placeholder='instagram'
          />
          <input
            type='text'
            value={state.mediumLink ?? ''}
            className='profile-panel__socials-field'
            onChange={(e) => {
              setState((prevState) => {
                return { ...prevState, mediumLink: e.target.value.trim() };
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
                return { ...prevState, webpage: e.target.value.trim() };
              });
            }}
            placeholder='webpage'
          />
        </div>
      </div>
      <div className='profile-panel__bio-group'>
        <h2 className='profile-panel__bio-label'>about section, max 400 characters</h2>
        <textarea
          value={state.bio as string}
          onChange={handleBioInput}
          className='profile-panel__bio-field'
        />
      </div>
      <button type='submit' className='profile-panel__save-button'>
        save your changes
      </button>
    </form>
  );
}
