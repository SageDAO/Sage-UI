import Logotype from '@/components/Logotype';
import IconWhite from '@/public/press/icon-white.svg';
import IconBlack from '@/public/press/icon-black.svg';
import LogotypeWhite from '@/public/press/logotype-white.svg';
import LogotypeBlack from '@/public/press/logotype-black.svg';

export default function press() {
  return (
    <div className='press-page'>
      <Logotype></Logotype>
      <div className='press-page__content'>
        <h1 className='press-page__header'>
          official press <pre></pre> release resources
        </h1>
        <div className='press-page__assets-container'>
          <div className='press-page__icons-container'>
            <div className='press-page__icon-white'>
              <IconWhite />
            </div>
            <div className='press-page__icon-black'>
              <IconBlack />
            </div>
          </div>
          <div className='press-page__logotypes-container'>
            <div className='press-page__logotype-white'>
              <LogotypeWhite />
            </div>
            <div className='press-page__logotype-black'>
              <LogotypeBlack />
            </div>
          </div>
        </div>
        <h3 className='press-page__subheader'>sage logotype and icon</h3>
        <p className='press-page__subheader-info'>
          Use this logotypes for any press releases or articles that is about SAGE. Please note SAGE
          is trademarked logo and using this logotype is not permitted  outside press releases
        </p>
      </div>
    </div>
  );
}
