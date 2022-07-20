import { useMintSingleNftMutation } from '@/store/nftsReducer';
import { toast } from 'react-toastify';
import { useSigner } from 'wagmi';

export default function Mint() {
  const [mintSingleNft] = useMintSingleNftMutation();
  const { data: signer } = useSigner();

  const handleMintButtonClick = async () => {
    if (!signer || !document) {
      toast.info('Sign In With Ethereum before continuing');
      return;
    }
    // TODO data validation
    const name = (document.getElementById('__name') as HTMLInputElement).value;
    const description = (document.getElementById('__description') as HTMLInputElement).value;
    const tags = (document.getElementById('__tags') as HTMLInputElement).value;
    const price = parseFloat((document.getElementById('__price') as HTMLInputElement).value);
    const fileInput = document.getElementById('__file') as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : undefined;
    if (file) {
      const result = await mintSingleNft({ name, description, tags, price, file, signer });
      const nftId = (result as any).nftId;
      if (!nftId || nftId == 0) {
        toast.error('Failure minting NFT');
      } else {
        toast.success(`Success! NFT minted with id ${nftId}`);
      }
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      mint a creation
      <br />
      <br />
      <br />
      <br />
      nft title: <input type='text' id='__name' name='name' value='Listing NFT' />
      <br />
      <br />
      nft description: <input type='text' id='__description' name='description' value='Test Description' />
      <br />
      <br />
      nft tags: <input type='text' id='__tags' name='tags' value='test dev' />
      <br />
      <br />
      nft price ash: <input type='text' id='__price' name='price' value='0,01' />
      <br />
      <br />
      nft file: <input type='file' id='__file' name='file' />
      <br />
      <br />
      <br />
      <button onClick={handleMintButtonClick}>mint!</button>
    </div>
  );
}
