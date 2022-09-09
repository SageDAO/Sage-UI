import { useSession } from 'next-auth/react';
import React from 'react';
import { useConnect } from 'wagmi';
import UserHandle from './UserHandle';
export default function PersonalizedMessage() {
  const { status: sessionStatus } = useSession();
  const { isConnected } = useConnect();

  if (sessionStatus === 'authenticated') {
    return (
      <React.Fragment>
        <span>Welcome back! </span>
        <pre></pre>
        <UserHandle />
      </React.Fragment>
    );
  }

  if (isConnected) {
    return null;
  }

  if (!isConnected) {
    return <span>Welcome! </span>;
  }
  return <React.Fragment>Error</React.Fragment>;
}
