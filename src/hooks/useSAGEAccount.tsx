import { parameters } from '@/constants/config';
import { useGetPointsBalanceQuery } from '@/store/pointsReducer';
import { useGetUserQuery } from '@/store/usersReducer';
import { useSession } from 'next-auth/react';
import { useAccount, useBalance, useConnect } from 'wagmi';

export default function useSAGEAccount() {
  const {
    address: walletAddress,
    isConnected: isWalletConnected,
    isConnecting: isWalletConnecting,
  } = useAccount({});
  const { data: userData } = useGetUserQuery();
  const { connect, connectors } = useConnect();
  const { status: sessionStatus, data: sessionData } = useSession();
  const isSignedIn: boolean = sessionStatus === 'authenticated';
  const { data: pointsBalance } = useGetPointsBalanceQuery(undefined, {
    skip: !isSignedIn,
  });
  const { data: walletBalance } = useBalance({
    token: parameters.ASHTOKEN_ADDRESS,
    addressOrName: walletAddress,
  });
  const ashBalance = Number(walletBalance?.formatted);
  const ashBalanceDisplay = isNaN(ashBalance) ? '' : ashBalance.toFixed(2);
  const pointsBalanceDisplay = isNaN(Number(pointsBalance)) ? '' : Number(pointsBalance).toFixed(2);

  return {
    isSignedIn,
    isWalletConnected,
    walletAddress,
    userData,
    isWalletConnecting,
    pointsBalance,
    ashBalance,
    ashBalanceDisplay,
    pointsBalanceDisplay,
    connect,
    connectors,
    sessionData,
  };
}
