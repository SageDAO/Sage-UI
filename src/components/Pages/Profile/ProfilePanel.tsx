import { PfpImage } from '@/components/Media';
import { useGetUserQuery } from '@/store/usersReducer';
import { User } from '@prisma/client';
import { useState, useEffect } from 'react';

import { useUpdateUserMutation } from '@/store/usersReducer';
import type { SafeUserUpdate } from '@/prisma/types';

interface State extends SafeUserUpdate {}

const INITIAL_STATE: State = { displayName: '', profilePicture: '', bio: '' };

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
      return { ...prevState, ...data };
    });
  }, [data]);
  return (
    <form onSubmit={handleFormSubmit} className='panel-profile'>
      <div className='panel-profile__pfp-group'>
        <div className='panel-profile__pfp-container'>
          <PfpImage src={state?.profilePicture}></PfpImage>
        </div>
        <h2 className='panel-profile__pfp-label'>add a profile picture</h2>
      </div>
      <div className='panel-profile__personal-group'>
        <h2 className='panel-profile__personal-label'>sage display name</h2>
        <input
          type='text'
          value={state?.displayName as string}
          onChange={(e) => {
            setState((prevState) => {
              return { ...prevState, displayName: e.target.value };
            });
          }}
          className='panel-profile__personal-field'
        />
      </div>
      <div className='panel-profile__socials-group'>
        <h2 className='panel-profile__socials-label'>add up to 4 social profiles</h2>
        <div className='panel-profile__socials-field-container'>
          <input type='text' className='panel-profile__socials-field' />
          <input type='text' className='panel-profile__socials-field' />
          <input type='text' className='panel-profile__socials-field' />
          <input type='text' className='panel-profile__socials-field' />
        </div>
      </div>
      <div className='panel-profile__bio-group'>
        <h2 className='panel-profile__bio-label'>about section, max 400 characters</h2>
        <textarea
          value={state.bio!}
          onChange={handleBioInput}
          className='panel-profile__bio-field'
        />
      </div>
      <button type='submit' className='panel-profile__save-button'>
        save your changes
      </button>
    </form>
  );
}
