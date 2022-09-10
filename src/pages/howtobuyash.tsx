import Logotype from '@/components/Logotype';

export default function howtobuyash() {
  return (
    <div className='howtobuyash'>
      <Logotype></Logotype>
      <div className='howtobuyash-header'>How to buy ASH </div>
      <div className='howtobuyash-text'>
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
