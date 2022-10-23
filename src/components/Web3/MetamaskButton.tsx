import React from 'react';
import MetamaskSVG from '@/public/icons/metamask.svg';
import detectEthereumProvider from '@metamask/detect-provider';
import { useRouter } from 'next/router';
import { parameters } from '@/constants/config';
import { useConnect } from 'wagmi';

interface Props {
  disabledCondition: boolean;
  dataLoading: string;
  connector: any;
}

const SAGEdeeplink = `https://metamask.app.link/dapp/${parameters.APP_URL}/`;
// const SAGEdeeplink = `https://metamask.app.link/dapp/sage-dev.vercel.app/`;

function MetamaskButton({ disabledCondition, dataLoading, connector }: Props) {
  const provider = detectEthereumProvider().then((provider) => {
    return provider;
  });

  const { connect, connectors } = useConnect();

  const router = useRouter();

  function openInMetamaskMobile() {
    window.open(SAGEdeeplink);
  }

  function connectWalletViaMetamask() {
    connect({ connector: connector });
  }

  function onClick() {
    provider ? connectWalletViaMetamask() : openInMetamaskMobile();
  }

  if (!provider) return null;

  return (
    <button
      className='wallet__wallet-item wallet__MetaMask'
      disabled={disabledCondition}
      data-loading={dataLoading}
      onClick={onClick}
    >
      <MetamaskSVG className='wallet__wallet-icon' />
      METAMASK
    </button>
  );
}

export default MetamaskButton;
