import { useSession } from 'next-auth/react';
import React from 'react';
import { useAccount, useConnect } from 'wagmi';
import UserHandle from './UserHandle';
export default function PersonalizedMessage() {
  const { status: sessionStatus } = useSession();
  const {} = useAccount();
  const { isConnected } = useConnect();

  if (sessionStatus === 'authenticated') {
    return (
      <React.Fragment>
        <span>welcome back! </span>
        <UserHandle />
      </React.Fragment>
    );
  }

  if (isConnected) {
    return <React.Fragment>sign in to continue</React.Fragment>;
  }

  if (!isConnected) {
    return <React.Fragment>wallet not connected</React.Fragment>;
  }
  return <React.Fragment>Error</React.Fragment>;
}
