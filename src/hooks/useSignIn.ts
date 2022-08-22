import { getCsrfToken, useSession } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { useSignInMutation } from '@/store/usersReducer';
import { useEffect } from 'react';
import { useConnect, useAccount, useSignMessage, useNetwork } from 'wagmi';

//This hook is dependent on a certain mounted component, and prompts a
//secure authentication to Sage using Sign In With Ethereum 4361

export default function useSignIn(isOpen: boolean) {
  const { activeChain } = useNetwork();
  const { data: accountData } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [signIn] = useSignInMutation();
  const { isConnected } = useConnect();
  const { status: sessionStatus } = useSession();

  async function handleSignInClick() {
    try {
      const nonce = await getCsrfToken();
      const message = new SiweMessage({
        domain: window.location.host,
        address: accountData?.address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: activeChain?.id,
        nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn({ message, signature });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const shouldPromptSignIn: boolean =
      isOpen && isConnected && sessionStatus === 'unauthenticated';
    if (shouldPromptSignIn) {
      handleSignInClick();
    }
  }, [isOpen, isConnected]);
}
