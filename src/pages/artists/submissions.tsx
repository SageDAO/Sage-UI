import Logotype from '@/components/Logotype';
import AdobeIllustratorSVG from '@/public/icons/adobe-illustrator.svg';
import IndesignSVG from '@/public/icons/indesign.svg';

export default function submissions() {
  return (
    <div className='submissions-page'>
      <div className='submissions-page__logotype-container'>
        <Logotype></Logotype>
      </div>
      <h1 className='submissions-page__header'>Artist Submissions</h1>
      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>Submissions Guidelines</h1>
        <p className='submissions-page__guidelines-text'>
          SAGE IS A HIGHLY CURATED PLATFORM, WE TAKE THE APPLICATION PROCESS VERY SERIOUSLY THAT’S
          THE REASON WE CHANGED THE WAY HOW ARTIST CAN APPLY TO BE A CREATOR ON THE SAGE PLATFORM.
          ARTIST SHOULD PRESENT THEIR WORKS IN A PDF FORMAT AND SUBMIT IT BELOW. WE WOULD LIKE YOU
          TO TAKE YOUR TIME TO PRESENT YOURSELF AND YOUR CREATIONS.
        </p>
      </section>
      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>Standards Guidelines</h1>
        <p className='submissions-page__guidelines-text'>
          SAGE IS A HIGHLY CURATED PLATFORM, WE TAKE THE APPLICATION PROCESS VERY SERIOUSLY THAT’S
          THE REASON WE CHANGED THE WAY HOW ARTIST CAN APPLY TO BE A CREATOR ON THE SAGE PLATFORM.
          ARTIST SHOULD PRESENT THEIR WORKS IN A PDF FORMAT AND SUBMIT IT BELOW. WE WOULD LIKE YOU
          TO TAKE YOUR TIME TO PRESENT YOURSELF AND YOUR CREATIONS.
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
          WE PROVIDE 2 TEMPLATES TO MAKE IT A BIT EASIER TO GET STARTED. YOU WONT NEED THIS IF YOU
          ALREADY MADE A PDF PRESENTATION.BELOW YOULL FIND AN INDESIGN AND ILLUSTRATOR FILE TO GET
          STARTED.
          <span className='submissions-page__design-icons'>
            <AdobeIllustratorSVG className='submissions-page__design-icons-svg'></AdobeIllustratorSVG>
            <IndesignSVG className='submissions-page__design-icons-svg'></IndesignSVG>
          </span>
        </p>
      </section>

      <section className='submissions-page__guidelines-group'>
        <h1 className='submissions-page__guidelines-header'>how to send application?</h1>
        <p className='submissions-page__guidelines-text'>
          ONCE READY, PLEASE SEND YOUR APPLICATION TO: creator@sage.com
        </p>
      </section>
    </div>
  );
}
