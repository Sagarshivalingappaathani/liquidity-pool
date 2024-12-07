"use client";
import { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { ToastContainer } from 'react-toastify';
import dynamic from 'next/dynamic';
import TokenLaunchPad from '@/components/TokenLaunchPad';
import CreateLiquidityPool from '@/components/CreatePool';
import TokenSwap from '@/components/TokenSwap';
import UserTokens from '@/components/TokenDisplay';
import 'react-toastify/dist/ReactToastify.css';

// Dynamic imports for wallet buttons to avoid server-side rendering issues
const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
const WalletDisconnectButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletDisconnectButton),
  { ssr: false }
);

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <div className="page"> {/* Added gradient background */}
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ToastContainer />
            <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-8 ">
              {/* Disclaimer */}
              <p className="text-sm text-center text-gray-600">
                This application works only on the <span className="font-semibold text-blue-600">Solana Devnet</span> only.
              </p>
              <div className="flex items-center space-x-4">
                <WalletMultiButtonDynamic className="btn-primary" />
                <WalletDisconnectButtonDynamic className="btn-secondary" />
              </div>
              <div className="w-full max-w-4xl">
                <UserTokens />
              </div>
              <div className="flex flex-row items-center w-full space-y-8 mb-5">
                <TokenLaunchPad />
                <CreateLiquidityPool />
                <TokenSwap />
              </div>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default App;