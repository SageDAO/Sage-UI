import Logotype from '@/components/Logotype';
import AdobeIllustratorSVG from '@/public/icons/adobe-illustrator.svg';
import IndesignSVG from '@/public/icons/indesign.svg';

export default function submissions() {
  return (
    <div className='submissions-page'>
      <div className='submissions-page__logotype-container'>
        <Logotype></Logotype>
      </div>
      <h1 className='submissions-page__header'>Artist Submission.</h1>
      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>Submissions Guidelines</h1>
        <p className='submissions-page__guidelines-text'>
          Sage is a highly curated platform, we take the application process very seriously that’s
          the reason we changed the way how artist can apply to be a creator on the sage platform.
          Artist should present their works in a pdf format and submit it below. We would like you
          to take your time to present yourself and your creations.
        </p>
      </section>
      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>Standards Guidelines</h1>
        <p className='submissions-page__guidelines-text'>
          When it comes to digital art, guidlines are provided so we can make sure not only the
          quality of the works are up to pair but also the standards of how the works will look and
          be presented in an exhibition outside of web.This standards are currently what we look for
          when checking the applications.In terms of animation or 3d rendering artwork we look for a
          quality of 4k standard and up.
        </p>
      </section>
      <section className='submissions-page__aspect-ratios-section'>
        <div className='submissions-page__aspect-ratios-group'>
          <div className='submissions-page__aspect-ratios-example'>
            <div className='submissions-page__aspect-ratios-1-1'></div>
          </div>
          <h1 className='submissions-page__aspect-ratios-label'>1:1 artworks</h1>
        </div>
        <div className='submissions-page__aspect-ratios-group'>
          <div className='submissions-page__aspect-ratios-example'>
            <div className='submissions-page__aspect-ratios-16-9'></div>
          </div>
          <h1 className='submissions-page__aspect-ratios-label'>16:9 artworks</h1>
        </div>

        <div className='submissions-page__aspect-ratios-group'>
          <div className='submissions-page__aspect-ratios-example'>
            <div className='submissions-page__aspect-ratios-9-16'></div>
          </div>
          <h1 className='submissions-page__aspect-ratios-label'>9:16 artworks</h1>
        </div>
      </section>
      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>some help</h1>
        <p className='submissions-page__guidelines-text'>
          Sage is a highly curated platform, we take the application process very seriously that’s
          the reason we changed the way how artist can apply to be a creator on the sage platform.
          Artist should present their works in a PDF format and submit it below. We would like you
          to take your time to present yourself and your creations.
          <span className='submissions-page__design-icons'>
            <AdobeIllustratorSVG className='submissions-page__design-icons-svg'></AdobeIllustratorSVG>
            <IndesignSVG className='submissions-page__design-icons-svg'></IndesignSVG>
          </span>
        </p>
      </section>

      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>how to send application?</h1>
        <p className='submissions-page__guidelines-text'>
          Once ready, please send your application to:
          <a href='mailto:creators@sage.art'> creators@sage.art</a>
        </p>
      </section>
    </div>
  );
}
