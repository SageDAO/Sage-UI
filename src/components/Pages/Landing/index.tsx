import SageFullLogoSVG from '@/public/branding/sage-full-logo.svg';
export default function LandingPage() {
  return (
    <div className='landing-page'>
      <div className='landing-page__content'>
        <div className='landing-page__sage-logo'>
          <SageFullLogoSVG className='landing-page__sage-svg' />
        </div>
        <h1 className='landing-page__title'>
          SAGE is a curation system created to refine and lead Web3. <pre /> Through our portal, you
          secure an entrance into the future.
        </h1>
      </div>
    </div>
  );
}
