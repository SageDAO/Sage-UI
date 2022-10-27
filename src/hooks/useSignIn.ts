import { getCsrfToken, useSession } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { useSignInMutation } from '@/store/usersReducer';
import { useEffect } from 'react';
import { useConnect, useAccount, useSignMessage, useNetwork } from 'wagmi';
import { parameters } from '@/constants/config';

//This hook is dependent on a certain mounted component, and prompts a
//secure authentication to Sage using Sign In With Ethereum 4361

export default function useSignIn(isOpen: boolean) {
  const { chain: activeChain } = useNetwork();
  const { data: connectData } = useConnect();
  const { address, isConnected } = useAccount();
  const { signMessageAsync, isLoading: isSigningMessage } = useSignMessage();
  const [signIn] = useSignInMutation();
  const { status: sessionStatus } = useSession();

  async function handleSignInClick() {
    try {
      const chainId = activeChain?.id;
      if (!address || !chainId) return;
      const issuedAt = new Date().toISOString();
      const nonce = await getCsrfToken();
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: `I accept the SAGE Terms of Service and Privacy Policy: ${parameters.APP_URL}termsofservice ${parameters.APP_URL}privacypolicy`,
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
        issuedAt,
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
      !isSigningMessage && isOpen && isConnected && sessionStatus === 'unauthenticated';
    if (shouldPromptSignIn) {
      handleSignInClick();
    }
  }, [isOpen, isConnected]);

  return { isSigningMessage };
}
