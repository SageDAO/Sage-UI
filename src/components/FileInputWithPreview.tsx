import { uploadFileToS3 } from '@/utilities/awsS3-client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import PlusSVG from '@/public/icons/plus.svg';

const EMPTY_PREVIEW = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const ACCEPTED_TYPES = [
  'image/png',
  'image/gif',
  'image/jpeg',
  'image/tiff',
  'image/svg+xml',
  'video/mp4',
];

interface Props {
  initialPreview?: string; // URL for initial image/video to be displayed
  onFileChange: (newFile: File) => void; // callback for when user selects a new input file
  onAspectRatioChange?: (width: number, height: number) => void; // callback when aspect ratio changes
  onGeneratePreview?: (s3Path: string, s3PathOptimized: string) => void; // callback in case a preview file is generated
  acceptedTypes?: string[]; // accepted file upload mime types
}

export default function FileInputWithPreview({
  initialPreview,
  onFileChange,
  onAspectRatioChange,
  onGeneratePreview,
  acceptedTypes,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>(
    initialPreview ? initialPreview : EMPTY_PREVIEW
  );
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
      setPreviewSrc(initialPreview ? initialPreview : EMPTY_PREVIEW);
      setContainerAspectRatio(previewSrc, isVideo);
    }
  }, [file]);

  function handleTiffFileUpload() {
    const LOADING_IMG = '/interactive/loading.gif';
    const ERROR_IMG = '/interactive/error.webp';
    setPreviewSrc(LOADING_IMG);
    var newPreview = ERROR_IMG;
    serverOptimizeTiffFile()
      .then(({ s3PathTiff, s3PathOptimized }) => {
        if (s3PathOptimized) {
          if (onGeneratePreview) {
            onGeneratePreview(s3PathTiff, s3PathOptimized);
          }
          newPreview = s3PathOptimized;
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setPreviewSrc(newPreview);
        setContainerAspectRatio(newPreview);
      });
  }

  async function serverOptimizeTiffFile(): Promise<{
    s3PathTiff: string;
    s3PathOptimized: string;
  }> {
    console.log('serverOptimizeTiffFile()');
    const s3PathTiff = await uploadFileToS3(
      '/api/endpoints/dropUpload/',
      'tiff',
      `${Date.now().toString()}_${file.name.toLowerCase()}`,
      file
    );
    const response = await fetch(`/api/endpoints/tiffConverter/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ s3PathTiff }),
    });
    const { s3PathOptimized } = await response.json();
    return { s3PathTiff, s3PathOptimized };
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files![0];
    var newFile = (acceptedTypes || ACCEPTED_TYPES).includes(selectedFile.type)
      ? selectedFile
      : null;
    setFile(newFile);
    onFileChange(newFile);
  }

  function handleBrowserSupportedFileUpload() {
    if (onGeneratePreview) {
      onGeneratePreview(null, null); // reset previously generated preview (if any) for the caller
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result: string = reader.result as string;
      if (isVideo) {
        let video = document.getElementById('artistCreationVideoPreview') as HTMLVideoElement;
        if (video) {
          video.pause();
          video.src = result;
          video.load();
          video.play();
        }
      }
      setPreviewSrc(result);
      setContainerAspectRatio(result, isVideo);
    };
    reader.readAsDataURL(file);
  }

  async function setContainerAspectRatio(data: string, isVideo: boolean = false) {
    const div = document.getElementById('file-upload-preview-container');
    if (div) {
      const { width, height } = isVideo
        ? await getVideoAspectRatio(data)
        : await getImageAspectRatio(data);
      const aspectRatio = `${width}/${height}`;
      console.log(`Setting aspect ratio to ${aspectRatio}`)
      div.style.aspectRatio = aspectRatio;
      if (onAspectRatioChange) {
        onAspectRatioChange(width, height);
      }
    }
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
          <source src={previewSrc} type={'video/mp4'} />
        </video>
      ) : (
        <Image draggable={false} src={previewSrc} layout='fill' objectFit='cover' />
      )}
    </div>
  );
}

async function getImageAspectRatio(data: string): Promise<{ width: number; height: number }> {
  if (data.startsWith('data:image/svg+xml')) {
    return getSVGAspectRatio(data);
  }
  let img = document.createElement('img');
  img.src = data;
  while (img.width == 0) {
    await new Promise((r) => setTimeout(r, 250)); // give the browser a sec to process img
  }
  return { width: img.width, height: img.height };
}

function getSVGAspectRatio(data: string): { width: number; height: number } {
  try {
    let decodedSvgText = atob(data.replace('data:image/svg+xml;base64,', ''));
    decodedSvgText = decodedSvgText.substring(decodedSvgText.indexOf('<svg'));
    let div = document.createElement('div');
    div.innerHTML = decodedSvgText;
    let svg = div.firstChild as SVGElement;
    let viewbox = svg.getAttribute('viewBox').split(' ');
    return { width: Number(viewbox[2]), height: Number(viewbox[3]) };
  } catch (e) {
    console.log(e);
    return { width: 100, height: 100 };
  }
}

async function getVideoAspectRatio(data: string): Promise<{ width: number; height: number }> {
  let video = document.createElement('video');
  let source = document.createElement('source');
  source.type = 'video/mp4';
  source.src = data;
  video.appendChild(source);
  while (video.videoWidth == 0) {
    await new Promise((r) => setTimeout(r, 250)); // give the browser a sec to process video
  }
  return { width: video.videoWidth, height: video.videoHeight };
}
