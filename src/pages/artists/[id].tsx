import { GetStaticPropsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { User } from '@prisma/client';
import prisma from '@/prisma/client';
import Hero from '@/components/Hero';
import { getIndividualArtistsPageData, getIndividualArtistsPagePaths } from '@/prisma/functions';
import { useBuySingleNftMutation, useGetArtistNftsQuery } from '@/store/nftsReducer';
import shortenAddress from '@/utilities/shortenAddress';
import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Nft_include_NftContract } from '@/prisma/types';

interface Props {
  artist: User;
}

export default function artist({ artist }: Props) {
  const { data: nfts } = useGetArtistNftsQuery(artist.walletAddress);
  const [buySingleNft] = useBuySingleNftMutation();
  const { data: signer } = useSigner();
  const handleBuyClick = async (artistContractAddress: string, nftId: number, price: number) => {
    if (!signer) {
      toast.info('Please Sign In before placing orders.');
      return;
    }
    await buySingleNft({ artistContractAddress, nftId, price, signer });
  };

  return (
    <div className='artist-page page' data-cy='artist-page'>
      <Hero imgSrc={artist.profilePicture || '/'} />
      {nfts &&
        nfts.map((nft: Nft_include_NftContract, i: number) => (
          <div style={{ textAlign: 'center' }} key={i}>
            <img src={nft.s3Path} width={200} />
            <br />"{nft.name}"<br />
            {nft.ownerAddress && `owned by ${shortenAddress(nft.ownerAddress)}`}
            {!nft.ownerAddress && (
              <>
                price: ${nft.price} ASH
                <br />
                <button
                  onClick={() =>
                    handleBuyClick(nft.NftContract?.contractAddress!, nft.id, nft.price!)
                  }
                >
                  buy now
                </button>
              </>
            )}
            <br />
            <br />
          </div>
        ))}
    </div>
  );
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
  if (!params) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const artist = await getIndividualArtistsPageData(prisma, String(params.id));

  if (!artist) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  return { props: { artist } };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = await getIndividualArtistsPagePaths(prisma);
  return { paths, fallback: 'blocking' };
}
