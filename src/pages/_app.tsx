import '@/styles/index.scss';
import Head from 'next/head';
import useTheme from '@/hooks/useTheme';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
// import 'react-medium-image-zoom/dist/styles.css';
import { Provider as ReduxProvider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import store from '@/store/store';
import type { AppProps } from 'next/app';
import MaintenancePage from '@/components/MaintenancePage';
import Layout from '@/components/Layout/Layout';
import { createClient, Provider as WagmiProvider, chain } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { parameters } from '@/constants/config';
import { useEffect, useRef, useState } from 'react';
import { SearchContext } from '@/store/searchContext';
import LandingPage from '@/components/Pages/Landing';

// set up connectors
const connectors = [
  new InjectedConnector({
    chains: [chain.mainnet, chain.rinkeby],
  }),
  new WalletConnectConnector({
    options: {
      qrcode: true,
    },
  }),
  new CoinbaseWalletConnector({
    options: {
      appName: 'sage',
    },
  }),
];

const wagmiClient = createClient({
  connectors,
  autoConnect: true,
});

const { SUBGRAPH_URL } = parameters;
const apolloClient = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
});

function App({ Component, pageProps, router }: AppProps) {
  useTheme();
  const [query, setQuery] = useState<string | null>(null);
  const isMaintenanceOn: boolean = process.env.NEXT_PUBLIC_MAINTENANCE_ON === 'true';

  return (
    <ReduxProvider store={store}>
      <WagmiProvider client={wagmiClient}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <ApolloProvider client={apolloClient}>
            <SearchContext.Provider value={{ query, setQuery }}>
              <Head>
                <title>Sage Marketplace</title>
                <link rel='icon' href='/icons/sage.svg' />
                <meta
                  name='viewport'
                  content='width=device-width,initial-scale=1,viewport-fit=cover'
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
          </ApolloProvider>
        </SessionProvider>
      </WagmiProvider>
    </ReduxProvider>
  );
}

export default App;
