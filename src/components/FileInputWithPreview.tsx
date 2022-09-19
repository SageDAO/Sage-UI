import Image from 'next/image';
import { useEffect, useState } from 'react';

const EMPTY_PREVIEW = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const ACCEPTED_TYPES = ['image/png', 'image/gif', 'image/jpeg', 'image/tiff', 'video/mp4'];

interface Props {
  initialPreview?: string; // URL for initial image/video to be displayed
  onFileChange: (newFile: File) => void; // callback for when user selects a new input file
  onGeneratePreview?: (s3PathOptimized: string) => void; // callback in case a preview file is generated
  acceptedTypes?: string[]; // accepted file upload mime types
}

export default function FileInputWithPreview({
  initialPreview,
  onFileChange,
  onGeneratePreview,
  acceptedTypes,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialPreview ? initialPreview : EMPTY_PREVIEW);
  const isVideo: boolean = file?.type == 'video/mp4';
  const isTiff: boolean = file?.type == 'image/tiff';

  useEffect(() => {
    if (file) {
      if (isTiff) {
        handleTiffFileUpload();
      } else {
        handleBrowserSupportedFileUpload();
      }
    } else {
      setPreview(initialPreview ? initialPreview : EMPTY_PREVIEW);
      setContainerAspectRatio(preview, isVideo);
    }
  }, [file]);

  function handleTiffFileUpload() {
    const LOADING_IMG = '/interactive/loading.gif';
    const ERROR_IMG = '/interactive/error.webp';
    setPreview(LOADING_IMG);
    var newPreview = ERROR_IMG;
    optimizeTiffFile()
      .then((s3PathOptimized) => {
        if (s3PathOptimized) {
          if (onGeneratePreview) {
            onGeneratePreview(s3PathOptimized);
          }
          newPreview = s3PathOptimized;
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setPreview(newPreview);
        setContainerAspectRatio(newPreview);
      });
  }

  async function optimizeTiffFile(): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const result = await fetch(`/api/endpoints/tiffUpload/`, {
      method: 'POST',
      body: formData,
    });
    const { s3PathOptimized } = await result.json();
    return s3PathOptimized;
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files![0];
    var newFile = (acceptedTypes || ACCEPTED_TYPES).includes(selectedFile.type) ? selectedFile : null;
    setFile(newFile);
    onFileChange(newFile);
  }

  function handleBrowserSupportedFileUpload() {
    if (onGeneratePreview) {
      onGeneratePreview(null); // reset previously generated preview (if any) for the caller
    }
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
  }

  return (
    <div id='file-upload-preview-container' className='creations-panel__file-upload-field-wrapper'>
      <input
        onChange={handleFileInputChange}
        type='file'
        className='creations-panel__file-upload-field'
        accept={(acceptedTypes || ACCEPTED_TYPES).join(',')}
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
    await new Promise((r) => setTimeout(r, 250));
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
    await new Promise((r) => setTimeout(r, 250));
  }
  return `${video.videoWidth}/${video.videoHeight}`;
}

async function setContainerAspectRatio(data: string, isVideo: boolean = false) {
  const div = document.getElementById('file-upload-preview-container');
  if (div) {
    const aspectRatio = isVideo ? await getVideoAspectRatio(data) : await getImageAspectRatio(data);
    div.style.aspectRatio = aspectRatio;
  }
}
