import Logotype from '@/components/Logotype';
import { parameters } from '@/constants/config';
import { toast } from 'react-toastify';
import { useToken } from 'wagmi';

const { ASHTOKEN_ADDRESS } = parameters;

export default function howtobuyash() {
  const { data: ashTokenData } = useToken({ address: ASHTOKEN_ADDRESS });

  async function handleImportASH() {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: ashTokenData.address, // The address that the token is at.
            symbol: ashTokenData.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: ashTokenData.decimals, // The number of decimals in the token
            // image: ashTokenData, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        toast.success('Successfully added token to wallet!');
      } else {
        toast.error('Error adding token to wallet');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='howtobuyash'>
      <Logotype></Logotype>
      <div className='howtobuyash-header'>How to buy ASH </div>
      <div className='howtobuyash-text'>
        <button onClick={handleImportASH} className='howtobuyash__import-button'>
          IMPORT ASH TO WALLET
        </button>
        <div className='howtobuyash__group'>
          <span className='howtobuyash-bullet'>Step 1</span>
          <p>
            Go to{' '}
            <a
              href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x64d91f12ece7362f91a6f8e7940cd55f05060b92&chain=mainnet'
              target='_blank'
              className='howtobuyash-text-link'
            >
              Uniswap
            </a>{' '}
            to exchange ETH for ASH.
          </p>
        </div>
        <div className='howtobuyash__group'>
          <span className='howtobuyash-bullet'>Step 2</span>
          <p>Connect your wallet to the site.</p>
        </div>
        <div className='howtobuyash__group'>
          <span className='howtobuyash-bullet'>Step 3</span>
          <p>Enter the desired amount of ASH you are purchasing. </p>
        </div>
        <div className='howtobuyash__group'>
          <span className='howtobuyash-bullet'>Step 4</span>
          <p>
            If you have not already approved the ASH token, hit Approve and confirm the action with
            your wallet provider.
          </p>
        </div>
        <div className='howtobuyash__group'>
          <span className='howtobuyash-bullet'>Step 5</span>
          <p>Hit Swap to confirm the exchange with Uniswap.</p>
        </div>
      </div>
      <div className='howtobuyash-header'>Earning Pixels </div>
      <p className='howtobuyash__earning-pixels-info'>
        When connecting to the platform, you immediately start earning pixels if you have ASH
        tokens. You will earn .25 Pixels a day per ASH. This reward is capped at 1000 ASH and will
        earn you 250 Pixels a day.
      </p>
    </div>
  );
}
