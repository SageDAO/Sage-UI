import { parameters } from '@/constants/config';
import { useGetPointsBalanceQuery } from '@/store/pointsReducer';
import { useGetUserQuery } from '@/store/usersReducer';
import { useBalance } from 'wagmi';

export default function Balances() {
  const { data: userData } = useGetUserQuery();
  const { data: pointsData } = useGetPointsBalanceQuery();
  const { data: walletBalance } = useBalance({
    token: parameters.ASHTOKEN_ADDRESS,
    addressOrName: userData?.walletAddress,
  });
  return (
    <div className='profile-page__balances'>
      <div className='profile-page__balances-points'>
        <h1 className='profile-page__balances-points-value'>{pointsData}</h1>
        <h1 className='profile-page__balances-points-label'>your pixel balance</h1>
      </div>
      <div className='profile-page__balances-token'>
        <h1 className='profile-page__balances-token-value'>
          {Number(walletBalance?.formatted).toFixed(4)}
        </h1>
        <h1 className='profile-page__balances-points-label'>your ash balance</h1>
      </div>
    </div>
  );
}
