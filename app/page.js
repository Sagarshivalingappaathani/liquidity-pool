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
            <div className="flex justify-between mb-6 space-x-4">
              <WalletMultiButtonDynamic className="btn-primary" />
              <WalletDisconnectButtonDynamic className="btn-secondary" />
            </div>
            <div className="flex justify-center mb-6 space-x-4">
              <TokenLaunchPad/>
              <CreateLiquidityPool />
              <TokenSwap />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default App;