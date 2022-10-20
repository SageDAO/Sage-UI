import useSAGEAccount from '@/hooks/useSAGEAccount';
import ReactTooltip from 'react-tooltip';

export default function Balances() {
  const { pointsBalanceDisplay, ashBalanceDisplay } = useSAGEAccount();
  const tooltip =
    'For each 100 ASH you hold,<br/>you will get 25 PIXEL per day<br/>(limited to 250 PIXEL/day)';
  return (
    <div className='profile-page__balances'>
      <ReactTooltip id='main' place={'top'} type={'light'} effect={'solid'} multiline={true} />
      <div className='profile-page__balances-token'>
        <h1 className='profile-page__balances-token-value'>{ashBalanceDisplay}</h1>
        <h1 className='profile-page__balances-points-label'>your ash balance</h1>
      </div>
      <div className='profile-page__balances-points'>
        <h1 className='profile-page__balances-points-value'>
          <a data-tip={tooltip} data-iscapture='true'>
            {pointsBalanceDisplay}
          </a>
        </h1>
        <h1 className='profile-page__balances-points-label'>your pixel balance</h1>
      </div>
    </div>
  );
}
