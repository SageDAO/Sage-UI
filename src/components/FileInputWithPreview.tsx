import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  initialPreview?: string, // URL for initial image/video to be displayed
  onFileChange: (newFile: File) => void;
}

export default function FileInputWithPreview({ onFileChange, initialPreview }: Props) {
  const EMPTY_PREVIEW =
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  const ACCEPTED_TYPES = ['image/png', 'image/gif', 'image/jpeg', 'video/mp4'];

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialPreview ? initialPreview : EMPTY_PREVIEW);

  const isVideo: boolean = file?.type == 'video/mp4';

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview: string = reader.result as string;
        if (isVideo) {
          let video = document.getElementById('artistCreationVideoPreview') as HTMLVideoElement;
          if (video) {
            video.pause();
            video.src = preview;
            video.load();
            video.play();
          }
        }
        setPreview(preview);
        setContainerAspectRatio(preview, isVideo);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(initialPreview ? initialPreview : EMPTY_PREVIEW);
    }
  }, [file]);

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files![0];
    const newFile = ACCEPTED_TYPES.includes(selectedFile.type) ? selectedFile : null;
    setFile(newFile);
    onFileChange(newFile);
  }

  return (
    <div id='file-upload-preview-container' className='creations-panel__file-upload-field-wrapper'>
      <input
        onChange={handleFileInputChange}
        type='file'
        className='creations-panel__file-upload-field'
        accept='image/png, image/gif, image/jpeg, video/mp4'
      />
      <Image
        className='creations-panel__file-upload-plus-icon'
        src='/icons/plus.svg'
        width={40}
        height={40}
      />

      {isVideo ? (
        <video
          id='artistCreationVideoPreview'
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
          style={{
            inset: '0px',
            overflow: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src={preview} type={'video/mp4'} />
        </video>
      ) : (
        <Image draggable={false} src={preview} layout='fill' objectFit='cover' />
      )}
    </div>
  );
}

async function getImageAspectRatio(data: string) {
  let img = document.createElement('img');
  img.src = data;
  while (img.width == 0) {
    await new Promise((r) => setTimeout(r, 500));
  }
  return `${img.width}/${img.height}`;
}

async function getVideoAspectRatio(data: string) {
  let video = document.createElement('video');
  let source = document.createElement('source');
  source.type = 'video/mp4';
  source.src = data;
  video.appendChild(source);
  while (video.videoWidth == 0) {
    await new Promise((r) => setTimeout(r, 500));
  }
  return `${video.videoWidth}/${video.videoHeight}`;
}

async function setContainerAspectRatio(data: string, isVideo: boolean) {
  const div = document.getElementById('file-upload-preview-container');
  if (div) {
    const aspectRatio = isVideo ? await getVideoAspectRatio(data) : await getImageAspectRatio(data);
    div.style.aspectRatio = aspectRatio;
  }
}
