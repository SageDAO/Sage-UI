import useSAGEAccount from '@/hooks/useSAGEAccount';
import ReactTooltip from 'react-tooltip';

export default function Balances() {
  const { pointsBalanceDisplay, ashBalance, ashBalanceDisplay } = useSAGEAccount();
  // if (!pointsBalanceDisplay || !ashBalanceDisplay) {
  //   return null;
  // }
  const pixelRate = getPixelRate(ashBalance);
  const tooltip = `You are currently earning ${pixelRate} pixels per day`;
  return (
    <div className='profile-page__balances'>
      <ReactTooltip
        id='main'
        place={'bottom'}
        type={'light'}
        effect={'solid'}
        multiline={true}
        offset={{ bottom: 40 }}
      />
      <div className='profile-page__balances-token'>
        <h1 className='profile-page__balances-token-value'>{ashBalanceDisplay}</h1>
        <h1 className='profile-page__balances-points-label'>your ash balance</h1>
      </div>
      <div className='profile-page__balances-points'>
        <h1 className='profile-page__balances-points-value'>
          <span data-for='main' data-tip={tooltip} data-iscapture='true'>
            {pointsBalanceDisplay}
          </span>
        </h1>
        <h1 className='profile-page__balances-points-label'>your pixel balance</h1>
      </div>
    </div>
  );
}

function getPixelRate(ashBalance: number) {
  if (isNaN(ashBalance) || ashBalance == 0) {
    return 0;
  }
  const rate = ashBalance / 4;
  return rate > 250 ? 250 : rate.toFixed(1);
}
