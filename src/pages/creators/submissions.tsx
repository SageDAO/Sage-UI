import Logotype from '@/components/Logotype';
import AdobeIllustratorSVG from '@/public/icons/adobe-illustrator.svg';
import IndesignSVG from '@/public/icons/indesign.svg';

export default function submissions() {
  return (
    <div className='submissions-page'>
      <div className='submissions-page__logotype-container'>
        <Logotype></Logotype>
      </div>
      <h1 className='submissions-page__header'>Artist Submission</h1>
      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>Submission Guidelines</h1>
        <p className='submissions-page__guidelines-text'>
          SAGE is a highly curated platform, we take the application process very seriously that’s
          the reason we changed the way how artist can apply to be a creator on the SAGE platform.
          Artist should present their works in a pdf format and submit it below. We would like you
          to <span className='submissions-page__emphasis'>take your time</span> to present yourself
          and your creations.
        </p>
      </section>
      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>Standards</h1>
        <p className='submissions-page__guidelines-text'>
          When it comes to digital art, we provide specific guidelines regarding technical standards
          and image resolution. Artists’ works must meet these requirements. We do this not only to
          ensure that the quality of the work is up to par but also to make certain that the work
          will meet our expectations of how the featured art will look—and be presented—in an
          exhibition outside the web. These standards are currently what we look for when checking
          artists’ applications. In terms of animation or 3D-rendering artwork, we seek a quality
          standard of 4k and up.
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
        <span className='submissions-page__design-icons'>
          <AdobeIllustratorSVG className='submissions-page__design-icons-svg'></AdobeIllustratorSVG>
          <IndesignSVG className='submissions-page__design-icons-svg'></IndesignSVG>
        </span>
      </section>
      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>How to Submit Your Application</h1>
        <p className='submissions-page__guidelines-text'>
          Once ready, please send your application to:
          <a href='mailto:creators@sage.art'> creators@sage.art</a>
        </p>
      </section>
    </div>
  );
}
