import '@/styles/index.scss';
import Head from 'next/head';
import useTheme from '@/hooks/useTheme';
import { Provider as ReduxProvider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import store from '@/store/store';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout/Layout';
import { createClient, WagmiConfig, configureChains, defaultChains, chain } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { useState } from 'react';
import { SearchContext } from '@/store/searchContext';
import LandingPage from '@/components/Pages/Landing';
import { infuraProvider } from 'wagmi/providers/infura';

// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import 'react-medium-image-zoom/dist/styles.css';
import 'video.js/dist/video-js.css';

// set up connectors

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli, chain.mainnet],
  [infuraProvider({}), publicProvider()]
);

const connectors = [
  new InjectedConnector({
    chains,
  }),
  new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  }),
];

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function App({ Component, pageProps, router }: AppProps) {
  const { theme } = useTheme();
  const [query, setQuery] = useState<string | null>(null);
  const isMaintenanceOn: boolean = process.env.NEXT_PUBLIC_MAINTENANCE_ON === 'true';

  const themeContent: string = theme === 'dark' ? '#101010' : 'white';
  return (
    <ReduxProvider store={store}>
      <WagmiConfig client={wagmiClient}>
        <SessionProvider refetchInterval={0}>
          <SearchContext.Provider value={{ query, setQuery }}>
            <Head>
              <title>SAGE</title>
              <link rel='icon' href='/icons/sage.svg' />
              <meta charSet='utf-8' />
              <meta
                name='viewport'
                content='width=device-width,initial-scale=1,viewport-fit=cover'
              />
              <meta name='theme-color' content={themeContent} />
              <meta
                name='description'
                content='SAGE is a portal into Web3, curating the space of the future.'
              />
            </Head>
            {isMaintenanceOn ? (
              <LandingPage />
            ) : (
              <Layout router={router}>
                <Component {...pageProps} key={router.pathname} />
              </Layout>
            )}
          </SearchContext.Provider>
        </SessionProvider>
      </WagmiConfig>
    </ReduxProvider>
  );
}

export default App;
