import useSAGEAccount from '@/hooks/useSAGEAccount';

export default function Balances() {
  const { pointsBalanceDisplay, ashBalanceDisplay } = useSAGEAccount();
  return (
    <div className='profile-page__balances'>
      <div className='profile-page__balances-token'>
        <h1 className='profile-page__balances-token-value'>{ashBalanceDisplay}</h1>
        <h1 className='profile-page__balances-points-label'>your ash balance</h1>
      </div>
      <div className='profile-page__balances-points'>
        <h1 className='profile-page__balances-points-value'>{pointsBalanceDisplay}</h1>
        <h1 className='profile-page__balances-points-label'>your pixel balance</h1>
      </div>
    </div>
  );
}
