import SageFullLogoSVG from '@/public/branding/sage-full-logo.svg';
export default function LandingPage() {
  return (
    <div className='landing-page'>
      <center className='landing-page__content'>
        <div className='landing-page__sage-logo'>
          <SageFullLogoSVG className='landing-page__sage-svg' />
        </div>
        <h1 className='landing-page__title'>
          SAGE is a curation system built to lead Web3. <pre />  Through our selection, we mark
          value into the
        </h1>
      </center>
    </div>
  );
}
