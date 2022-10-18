import { PfpImage } from '@/components/Media/BaseMedia';
import TwitterSVG from '@/public/socials/twitter.svg';
import MediumSVG from '@/public/socials/medium.svg';
import InstagramSVG from '@/public/socials/insta.svg';
import WebSVG from '@/public/socials/web.svg';
import { useGetUserQuery, useUpdateArtistMutation } from '@/store/usersReducer';
import { useState, useEffect } from 'react';
import { useUpdateUserMutation } from '@/store/usersReducer';
import type { SafeUserUpdate } from '@/prisma/types';
import useModal from '@/hooks/useModal';
import ProfilePictureModal from '@/components/Modals/ProfilePictureModal';
import { useSession } from 'next-auth/react';
import {
  validateEmail,
  validateInstagram,
  validateMedium,
  validateTwitter,
  validateWebpage,
} from './ProfileValidation';
import { toast } from 'react-toastify';
import FileInputWithPreview from '@/components/FileInputWithPreview';

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
  bannerImageS3Path: '',
};

interface Props {
  isArtist: boolean;
}

export default function ProfilePanel({ isArtist }: Props) {
  const { data: sessionData } = useSession();
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [artistBannerFile, setArtistBannerFile] = useState<File | null>(null);
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [updateArtist, { isLoading: isUpdatingArtist }] = useUpdateArtistMutation();
  const { data } = useGetUserQuery(undefined, { skip: !sessionData });
  const {
    isOpen: isProfilePicModalOpen,
    closeModal: closeProfilePicModal,
    openModal: openProfilePicModal,
  } = useModal();

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    if (state.bio && state.bio.length > 400) {
      toast.warn('Please keep bio to 400 chars (max)');
      return;
    }
    if (isArtist && artistBannerFile) {
      await updateArtist({ user: state, bannerFile: artistBannerFile });
    } else {
      await updateUser(state);
    }
  }

  function handleFileInputChange(file: File | null) {
    setArtistBannerFile(file);
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
      <form onSubmit={handleFormSubmit} className='profile-panel'>
        <ProfilePictureModal
          isOpen={isProfilePicModalOpen}
          closeModal={closeProfilePicModal}
          title='Profile Picture'
        />
        <div className='profile-panel__uploads'>
          <div className='profile-panel__pfp-group'>
            <div onClick={openProfilePicModal} className='profile-panel__pfp-container'>
              <PfpImage src={state?.profilePicture}></PfpImage>
            </div>
            <p className='profile-panel__pfp-label'>
              ADD OR CHANGE <br /> PROFILE PICTURE
            </p>
          </div>

          {isArtist && (
            <div className='profile-panel__banner-group'>
              <div className='profile-panel__banner-container'>
                <FileInputWithPreview
                  initialPreview={data.bannerImageS3Path}
                  acceptedTypes={['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml']}
                  onFileChange={handleFileInputChange}
                />
              </div>

              <p className='profile-panel__pfp-label'>
                ADD OR CHANGE <br /> BANNER PICTURE
              </p>
            </div>
          )}
        </div>
        <div className='profile-panel__username-group'>
          <input
            type='text'
            value={state?.username ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setState((prevState) => {
                return { ...prevState, username: e.target.value };
              });
            }}
            maxLength={40}
            placeholder='USERNAME'
            className='profile-panel__username-field'
          />
        </div>
        <div className='profile-panel__email-group'>
          <input
            type='text'
            value={state?.email ?? ''}
            placeholder='EMAIL'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setState((prevState) => {
                return { ...prevState, email: e.target.value.trim() };
              });
            }}
            maxLength={40}
            className='profile-panel__email-field'
          />
        </div>
        <div className='profile-panel__bio-group'>
          <p className='profile-panel__bio-label'>
            about{' '}
            <span style={state.bio && state.bio.length > 400 ? { color: 'red' } : {}}>
              ({state.bio?.length || 0}/400 chars max)
            </span>
          </p>
          <textarea
            value={(state.bio as string) || ''}
            onChange={handleBioInput}
            placeholder='ABOUT'
            className='profile-panel__bio-field'
          />
        </div>

        <div className='profile-panel__socials-group'>
          <p className='profile-panel__socials-label'>Connect Your Social Profile</p>
          <div className='profile-panel__socials-field-container'>
            <TwitterSVG
              type='text'
              value={state.twitterUsername ?? ''}
              className='profile-panel__socials-field'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prevState) => {
                  return { ...prevState, twitterUsername: e.target.value.trim() };
                });
              }}
            />
            <InstagramSVG
              type='text'
              value={state.instagramUsername ?? ''}
              className='profile-panel__socials-field'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prevState) => {
                  return { ...prevState, instagramUsername: e.target.value.trim() };
                });
              }}
            />
            <MediumSVG
              type='text'
              value={state.mediumUsername ?? ''}
              className='profile-panel__socials-field'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prevState) => {
                  return { ...prevState, mediumUsername: e.target.value.trim() };
                });
              }}
            />
            <WebSVG
              type='text'
              value={state.webpage ?? ''}
              className='profile-panel__socials-field'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prevState) => {
                  return { ...prevState, webpage: e.target.value.trim() };
                });
              }}
            />
          </div>
        </div>
        <button
          disabled={isUpdatingUser || isUpdatingArtist}
          type='submit'
          className='profile-panel__save-button'
        >
          save your changes
        </button>
      </form>
      {/* <section className='profile-page__delete-profile-section'>
        <p className='profile-page__delete-profile-info'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt ullam animi labore
          consequatur, deserunt eius cum optio quae ducimus? Corrupti, asperiores a. Nostrum odio
          tempora soluta illo, rem vel harum!
        </p>
        <button className='profile-page__delete-profile-button'>Delete Profile</button>
      </section> */}
    </>
  );
}
