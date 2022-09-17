import useSAGEAccount from '@/hooks/useSAGEAccount';
import React from 'react';
import UserHandle from './UserHandle';
export default function PersonalizedMessage() {
  const { isSignedIn, isWalletConnected } = useSAGEAccount();

  if (isSignedIn) {
    return (
      <React.Fragment>
        <span>Welcome back! </span>
        <pre></pre>
        <UserHandle />
      </React.Fragment>
    );
  }

  if (isWalletConnected) {
    return null;
  }

  if (!isWalletConnected) {
    return <span>Welcome! </span>;
  }
  return <React.Fragment>Error</React.Fragment>;
}
