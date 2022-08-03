import { PfpImage } from '@/components/Media';
import { useGetUserQuery } from '@/store/usersReducer';
import { useState, useEffect } from 'react';
import { useUpdateUserMutation } from '@/store/usersReducer';
import type { SafeUserUpdate } from '@/prisma/types';
import useModal from '@/hooks/useModal';
import ProfilePictureModal from '@/components/Modals/ProfilePictureModal';
import { useSession } from 'next-auth/react';
import { animated, Spring } from 'react-spring';
import {
  validateEmail,
  validateInstagram,
  validateMedium,
  validateTwitter,
  validateWebpage,
} from './ProfileValidation';
import { toast } from 'react-toastify';

interface State extends SafeUserUpdate {}

const INITIAL_STATE: State = {
  username: '',
  email: '',
  profilePicture: '',
  bio: '',
  webpage: '',
  twitterUsername: '',
  instagramUsername: '',
  mediumUsername: '',
};

export default function ProfilePanel() {
  const { data: sessionData } = useSession();
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { data } = useGetUserQuery(undefined, { skip: !sessionData });
  const {
    isOpen: isProfilePicModalOpen,
    closeModal: closeProfilePicModal,
    openModal: openProfilePicModal,
  } = useModal();

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateEmail(state.email)) {
      toast.warn('Please provide a valid e-mail address');
      return;
    }
    if (!validateTwitter(state.twitterUsername)) {
      toast.warn('Please provide a valid twitter handle');
      return;
    }
    if (!validateInstagram(state.instagramUsername)) {
      toast.warn('Please provide a valid instagram account');
      return;
    }
    if (!validateMedium(state.mediumUsername)) {
      toast.warn('Please provide a valid medium account');
      return;
    }
    if (!validateWebpage(state.webpage)) {
      toast.warn('Please provide a valid webpage URL');
      return;
    }
    updateUser(state);
  }

  function handleBioInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setState((prevState) => {
      return { ...prevState, bio: e.target.value };
    });
  }

  useEffect(() => {
    if (data) {
      setState((prevState) => {
        return { ...data };
      });
    }
  }, [data]);

  return (
    <>
      <Spring to={{ translateX: 0 }} from={{ translateX: -100 }}>
        {(styles) => {
          return (
            <animated.h1 style={styles} className='profile-page__tabs-panel-header'>
              profile
              <span className='profile-page__tabs-panel-subheader'>edit your sage profile</span>
            </animated.h1>
          );
        }}
      </Spring>

      <Spring to={{ translateX: 0 }} from={{ translateX: -100 }}>
        {(styles) => {
          return (
            <animated.form onSubmit={handleFormSubmit} style={styles} className='profile-panel'>
              <ProfilePictureModal
                isOpen={isProfilePicModalOpen}
                closeModal={closeProfilePicModal}
                title='Profile Picture'
              />
              <div className='profile-panel__pfp-group'>
                <div onClick={openProfilePicModal} className='profile-panel__pfp-container'>
                  <PfpImage src={state?.profilePicture}></PfpImage>
                </div>
                <h2 className='profile-panel__pfp-label'>add a profile picture</h2>
              </div>
              <div className='profile-panel__personal-group'>
                <h2 className='profile-panel__personal-label'>sage username</h2>
                <input
                  type='text'
                  value={state?.username ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setState((prevState) => {
                      return { ...prevState, username: e.target.value };
                    });
                  }}
                  maxLength={40}
                  className='profile-panel__personal-field'
                />
              </div>
              <div className='profile-panel__personal-group'>
                <h2 className='profile-panel__personal-label'>e-mail</h2>
                <input
                  type='text'
                  value={state?.email ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setState((prevState) => {
                      return { ...prevState, email: e.target.value };
                    });
                  }}
                  maxLength={40}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setState((prevState) => {
                        return { ...prevState, twitterUsername: e.target.value };
                      });
                    }}
                    maxLength={40}
                    placeholder='twitter'
                  />
                  <input
                    type='text'
                    value={state.instagramUsername ?? ''}
                    className='profile-panel__socials-field'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setState((prevState) => {
                        return { ...prevState, instagramUsername: e.target.value };
                      });
                    }}
                    maxLength={40}
                    placeholder='instagram'
                  />
                  <input
                    type='text'
                    value={state.mediumUsername ?? ''}
                    className='profile-panel__socials-field'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setState((prevState) => {
                        return { ...prevState, mediumUsername: e.target.value };
                      });
                    }}
                    maxLength={40}
                    placeholder='medium'
                  />
                  <input
                    type='text'
                    value={state.webpage ?? ''}
                    className='profile-panel__socials-field'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setState((prevState) => {
                        return { ...prevState, webpage: e.target.value };
                      });
                    }}
                    maxLength={50}
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
            </animated.form>
          );
        }}
      </Spring>
    </>
  );
}
