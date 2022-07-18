import { useMintSingleNftMutation } from '@/store/nftsReducer';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useSigner } from 'wagmi';

export default function Mint() {
  const [mintSingleNft] = useMintSingleNftMutation();
  const { data: signer } = useSigner();

  const [data, setData] = useState({
    name: '',
    description: '',
    tags: '',
    price: '0',
    file: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleMintButtonClick = async () => {
    if (!signer) {
      toast.info('Sign In With Ethereum before continuing');
      return;
    }
    // TODO data validation
    // const nftId = await mintSingleNft({
    //   name: data.name,
    //   description: data.description,
    //   tags: data.tags,
    //   price: parseFloat(data.price.toString()),
    //   file: data.file,
    //   signer,
    // });
    // toast.success(`Success! NFT minted with id ${nftId}`);
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
      nft title: <input type='text' name='name' onChange={handleChange} />
      <br />
      <br />
      nft description: <input type='text' name='description' onChange={handleChange} />
      <br />
      <br />
      nft tags: <input type='text' name='tags' onChange={handleChange} />
      <br />
      <br />
      nft price ash: <input type='text' name='price' onChange={handleChange} />
      <br />
      <br />
      nft file: <input type='file' name='file' onChange={handleChange} />
      <br />
      <br />
      <br />
      <button onClick={handleMintButtonClick}>mint!</button>
    </div>
  );
}
