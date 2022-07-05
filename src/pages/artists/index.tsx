import Logotype from '@/components/Logotype';
import { BaseMedia } from '@/components/Media';
import { User } from '@prisma/client';
import prisma from '@/prisma/client';
import { useRouter } from 'next/router';


interface Props {
  artists: User[];
}

export default function artists({ artists }: Props) {
  const router = useRouter();
  return (
    <div className='artists-page page'>
      <div className='artists-page__logotype'>
        <Logotype />
      </div>
      <section className='artists-page__row'>
        {artists.map((a, i: number) => {
          return (
            <>
              <div
                className='artists-page__item'
                onClick={async () => {
                  await router.push(`/artists/${a.walletAddress}`);
                }}
                key={i}
              >
                <div className='artists-page__item-img'>
                  <BaseMedia src='/sample/pak.png'></BaseMedia>
                  <h1 className='artists-page__item-img-text'>
                    drop by {a.displayName} <br />
                    Sage Curated
                  </h1>
                </div>
                <div className='artists-page__item-content'>
                  <h1 className='artists-page__item-content-header'>{a.displayName}</h1>
                  <p className='artists-page__item-content-description'>
                    PAK, FORMERLY KNOWN AS MURAT PAK, IS A DIGITAL ARTIST, CRYPTOCURRENCY INVESTOR,
                    AND PROGRAMMER. THE IDENTITY OF PAK IS UNKNOWN AND SOME SPECULATE THAT IT MAY BE
                    A TEAM. PAK IS KNOWN FOR CREATING THE CURATION PLATFORM ARCHILLECT, AN INTERNET
                    BOT WHICH RESHARES MEDIA BASED ON USER INTERACTIONS WITH CONTENT HOSTED ON
                    VARIOUS SOCIAL PLATFORMS AND FOR LAUNCHING A PLATFORM FOR BURNING (PERMANENTLY
                    REMOVING FROM CIRCULATION) NFTS TO RECEIVE TOKENS OF THE CRYPTOCURRENCY ASH.
                  </p>
                </div>
              </div>

              <div
                className='artists-page__item'
                onClick={async () => {
                  await router.push(`/artists/${a.walletAddress}`);
                }}
                key={i}
              >
                <div className='artists-page__item-img'>
                  <BaseMedia src='/sample/pak.png'></BaseMedia>
                  <h1 className='artists-page__item-img-text'>
                    drop by {a.displayName} <br />
                    Sage Curated
                  </h1>
                </div>
                <div className='artists-page__item-content'>
                  <h1 className='artists-page__item-content-header'>{a.displayName}</h1>
                  <p className='artists-page__item-content-description'>
                    PAK, FORMERLY KNOWN AS MURAT PAK, IS A DIGITAL ARTIST, CRYPTOCURRENCY INVESTOR,
                    AND PROGRAMMER. THE IDENTITY OF PAK IS UNKNOWN AND SOME SPECULATE THAT IT MAY BE
                    A TEAM. PAK IS KNOWN FOR CREATING THE CURATION PLATFORM ARCHILLECT, AN INTERNET
                    BOT WHICH RESHARES MEDIA BASED ON USER INTERACTIONS WITH CONTENT HOSTED ON
                    VARIOUS SOCIAL PLATFORMS AND FOR LAUNCHING A PLATFORM FOR BURNING (PERMANENTLY
                    REMOVING FROM CIRCULATION) NFTS TO RECEIVE TOKENS OF THE CRYPTOCURRENCY ASH.
                  </p>
                </div>
              </div>

              <div
                className='artists-page__item'
                onClick={async () => {
                  await router.push(`/artists/${a.walletAddress}`);
                }}
                key={i}
              >
                <div className='artists-page__item-img'>
                  <BaseMedia src='/sample/pak.png'></BaseMedia>
                  <h1 className='artists-page__item-img-text'>
                    drop by {a.displayName} <br />
                    Sage Curated
                  </h1>
                </div>
                <div className='artists-page__item-content'>
                  <h1 className='artists-page__item-content-header'>{a.displayName}</h1>
                  <p className='artists-page__item-content-description'>
                    PAK, FORMERLY KNOWN AS MURAT PAK, IS A DIGITAL ARTIST, CRYPTOCURRENCY INVESTOR,
                    AND PROGRAMMER. THE IDENTITY OF PAK IS UNKNOWN AND SOME SPECULATE THAT IT MAY BE
                    A TEAM. PAK IS KNOWN FOR CREATING THE CURATION PLATFORM ARCHILLECT, AN INTERNET
                    BOT WHICH RESHARES MEDIA BASED ON USER INTERACTIONS WITH CONTENT HOSTED ON
                    VARIOUS SOCIAL PLATFORMS AND FOR LAUNCHING A PLATFORM FOR BURNING (PERMANENTLY
                    REMOVING FROM CIRCULATION) NFTS TO RECEIVE TOKENS OF THE CRYPTOCURRENCY ASH.
                  </p>
                </div>
              </div>

              <div
                className='artists-page__item'
                onClick={async () => {
                  await router.push(`/artists/${a.walletAddress}`);
                }}
                key={i}
              >
                <div className='artists-page__item-img'>
                  <BaseMedia src='/sample/pak.png'></BaseMedia>
                  <h1 className='artists-page__item-img-text'>
                    drop by {a.displayName} <br />
                    Sage Curated
                  </h1>
                </div>
                <div className='artists-page__item-content'>
                  <h1 className='artists-page__item-content-header'>{a.displayName}</h1>
                  <p className='artists-page__item-content-description'>
                    PAK, FORMERLY KNOWN AS MURAT PAK, IS A DIGITAL ARTIST, CRYPTOCURRENCY INVESTOR,
                    AND PROGRAMMER. THE IDENTITY OF PAK IS UNKNOWN AND SOME SPECULATE THAT IT MAY BE
                    A TEAM. PAK IS KNOWN FOR CREATING THE CURATION PLATFORM ARCHILLECT, AN INTERNET
                    BOT WHICH RESHARES MEDIA BASED ON USER INTERACTIONS WITH CONTENT HOSTED ON
                    VARIOUS SOCIAL PLATFORMS AND FOR LAUNCHING A PLATFORM FOR BURNING (PERMANENTLY
                    REMOVING FROM CIRCULATION) NFTS TO RECEIVE TOKENS OF THE CRYPTOCURRENCY ASH.
                  </p>
                </div>
              </div>

              <div
                className='artists-page__item'
                onClick={async () => {
                  await router.push(`/artists/${a.walletAddress}`);
                }}
                key={i}
              >
                <div className='artists-page__item-img'>
                  <BaseMedia src='/sample/pak.png'></BaseMedia>
                  <h1 className='artists-page__item-img-text'>
                    drop by {a.displayName} <br />
                    Sage Curated
                  </h1>
                </div>
                <div className='artists-page__item-content'>
                  <h1 className='artists-page__item-content-header'>{a.displayName}</h1>
                  <p className='artists-page__item-content-description'>
                    PAK, FORMERLY KNOWN AS MURAT PAK, IS A DIGITAL ARTIST, CRYPTOCURRENCY INVESTOR,
                    AND PROGRAMMER. THE IDENTITY OF PAK IS UNKNOWN AND SOME SPECULATE THAT IT MAY BE
                    A TEAM. PAK IS KNOWN FOR CREATING THE CURATION PLATFORM ARCHILLECT, AN INTERNET
                    BOT WHICH RESHARES MEDIA BASED ON USER INTERACTIONS WITH CONTENT HOSTED ON
                    VARIOUS SOCIAL PLATFORMS AND FOR LAUNCHING A PLATFORM FOR BURNING (PERMANENTLY
                    REMOVING FROM CIRCULATION) NFTS TO RECEIVE TOKENS OF THE CRYPTOCURRENCY ASH.
                  </p>
                </div>
              </div>
            </>
          );
        })}
      </section>
    </div>
  );
}

export async function getStaticProps() {
  let artists: User[] = await prisma.user.findMany({
    take: 5,
    where: { role: 'ARTIST' },
  });

  return {
    props: {
      artists,
    },
    revalidate: 60,
  };
}
