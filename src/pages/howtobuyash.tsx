import Logotype from '@/components/Logotype';

export default function howtobuyash() {
  return (
    <div className='howtobuyash'>
      <Logotype></Logotype>
      <div className='howtobuyash-header'>How to buy ASH </div>
      <div className='howtobuyash-text'>
        <p>
          <span className='howtobuyash-bullet'>1.</span> Go to{' '}
          <a
            href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x64d91f12ece7362f91a6f8e7940cd55f05060b92&chain=mainnet'
            target='_blank'
            className='howtobuyash-text-link'
          >
            Uniswap
          </a>{' '}
          to exchange ETH for ASH.
        </p>
        <p>
          <span className='howtobuyash-bullet'>2.</span> Connect your wallet to the site.
        </p>
        <p>
          <span className='howtobuyash-bullet'>3.</span> Enter the desired amount of ASH you are
          purchasing.{' '}
        </p>
        <p>
          <span className='howtobuyash-bullet'>4.</span> If you have not already approved the ASH
          token, hit Approve and confirm the action with your wallet provider.
        </p>
        <p>
          <span className='howtobuyash-bullet'>5.</span> Hit Swap to confirm the exchange with
          Uniswap.
        </p>
      </div>
      <div className='howtobuyash-header'>Earning Pixels </div>
      <div className='howtobuyash-text'>
        <p>
          When connecting to the platform, you immediately start
          earning pixels if you have ASH tokens. You will earn .25 Pixels a day per ASH. This reward
          is capped at 1000 ASH and will earn you 250 Pixels a day.
        </p>
      </div>
    </div>
  );
}
