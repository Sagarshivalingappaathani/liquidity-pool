import React, { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getMint, getTokenMetadata, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { toast } from 'react-toastify';
import { fetchCPMMPoolInfo, getAmountOfTokenBForTokenA, getAmountOfTokenBForTokenAv2, swapTokenAForTokenB } from '../utils/raydium.functions';
import { SwapOutlined } from '@ant-design/icons';

// Improved debounce function with cancel method
function debounce(func, wait) {
  let timeout;
  function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
  executedFunction.cancel = () => {
    clearTimeout(timeout);
  };
  return executedFunction;
}

const TokenSwap = () => {
  const { connection } = useConnection();
  const walletContext = useWallet();
  const [userTokens, setUserTokens] = useState([]);
  const [selectedTokenA, setSelectedTokenA] = useState('');
  const [selectedTokenB, setSelectedTokenB] = useState('');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState(0);
  const [loading, setLoading] = useState(false);
  const [calculatingAmountB, setCalculatingAmountB] = useState(false);
  const [poolId, setPoolId] = useState(null);
  useEffect(() => {
    if (walletContext.publicKey) {
      fetchUserTokens();
    }
  }, [walletContext.publicKey, connection]);

  const debouncedCalculateAmountB = useCallback(
    debounce(async () => {
      if (selectedTokenA && selectedTokenB && amountA) {
        setCalculatingAmountB(true);
        try {
          const result = await getAmountOfTokenBForTokenAv2(
            walletContext,
            new PublicKey(selectedTokenA),
            new PublicKey(selectedTokenB),
            parseFloat(amountA)
          );
          if (result === null) {
            setAmountB(null);
          } else {
            setAmountB(result.newAmountOfTokenB);
            setPoolId(result.poolId);
          }
        } catch (error) {
          console.error('Error calculating amount B:', error);
          setAmountB(null);
        } finally {
          setCalculatingAmountB(false);
        }
      } else {
        setAmountB(0);
      }
    }, 500),
    [selectedTokenA, selectedTokenB, amountA, walletContext]
  );

  useEffect(() => {
    debouncedCalculateAmountB();
    return () => {
      if (debouncedCalculateAmountB.cancel) {
        debouncedCalculateAmountB.cancel();
      }
    };
  }, [selectedTokenA, selectedTokenB, amountA, debouncedCalculateAmountB]);

  const fetchUserTokens = async () => {
    if (!walletContext.publicKey) return;

    try {
      // Fetch SOL balance
      const solBalance = await connection.getBalance(walletContext.publicKey);
      const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
      const solToken = {
        mint: SOL_MINT.toBase58(),
        balance: solBalance / LAMPORTS_PER_SOL,
        symbol: 'SOL',
        name: 'Solana',
        image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      };

      // Fetch SPL tokens (including TOKEN_2022)
      let tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletContext.publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });
      let token2022Accounts = await connection.getParsedTokenAccountsByOwner(walletContext.publicKey, {
        programId: TOKEN_2022_PROGRAM_ID,
      });

      let allTokenAccounts = [
        ...tokenAccounts.value.map(token => ({ ...token, programId: TOKEN_PROGRAM_ID })),
        ...token2022Accounts.value.map(token => ({ ...token, programId: TOKEN_2022_PROGRAM_ID }))
      ];
      allTokenAccounts = await Promise.all(allTokenAccounts.map(async token => {
        const mintInfo = await getMint(connection, new PublicKey(token.account.data.parsed.info.mint), 'confirmed', token.programId);
        return mintInfo.mintAuthority && mintInfo.mintAuthority.toBase58() !== '7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw' ? token : null;
      }));
      allTokenAccounts = allTokenAccounts.filter(token => token !== null);
      console.log(allTokenAccounts);

      const tokensPromises = allTokenAccounts.map(async (accountInfo) => {
        const mintAddress = accountInfo.account.data.parsed.info.mint;
        const balance = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;

        if (balance === 0) return null; // Skip tokens with zero balance

        try {
          let tokenMetadata;
          if (accountInfo.programId === TOKEN_2022_PROGRAM_ID) {
            tokenMetadata = await getTokenMetadata(
              connection,
              new PublicKey(mintAddress),
              'confirmed',
              accountInfo.programId
            );
            const uriDetails = await fetch(tokenMetadata.uri);
            const metadata = await uriDetails.json();
            return {
              mint: mintAddress,
              balance: balance,
              symbol: metadata.symbol,
              name: metadata.name,
              image: metadata.image,
            };
          } else {
            // For TOKEN_PROGRAM_ID, use a fallback method or external API to get token info
            // This is a placeholder, you might want to use a token list API or other method
            return {
              mint: mintAddress,
              balance: balance,
              symbol: 'Unknown',
              name: `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
              image: '',
            };
          }
        } catch (error) {
          console.error(`Error fetching metadata for token ${mintAddress}:`, error);
          return {
            mint: mintAddress,
            balance: balance,
            symbol: 'Unknown',
            name: `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
            image: '',
          };
        }
      });

      const tokens = await Promise.all(tokensPromises);
      const validTokens = [solToken, ...tokens.filter(token => token !== null)];
      setUserTokens(validTokens);
    } catch (error) {
      console.error('Error fetching user tokens:', error);
      toast.error('Failed to fetch user tokens. Please try again.');
    }
  };

  const handleSwap = async () => {
    if (!selectedTokenA || !selectedTokenB || !amountA) {
      toast.error('Please select tokens and enter an amount to swap.');
      return;
    }

    setLoading(true);
    try {
      // Here you would typically call a function to perform the swap
      // For now, we'll just fetch the pool info as a placeholder
      const swapResult = await swapTokenAForTokenB(walletContext, new PublicKey(selectedTokenA), parseFloat(amountA), poolId);
      setAmountA('')
      setSelectedTokenA('')
      setSelectedTokenB('')
      if (swapResult) {
        toast.success('Your swap request has been initiated. Please check your wallet for confirmation.');
      }
      else {
        toast.error('Failed to swap tokens. Please try again.');
      }
    } catch (error) {
      //console.error('Error swapping tokens:', error);
      toast.error('Failed to swap tokens. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapInputs = () => {
    setSelectedTokenA(selectedTokenB);
    setSelectedTokenB(selectedTokenA);
    setAmountA('');
    setAmountB(0);
  };

  const handleAmountAChange = (e) => {
    const value = e.target.value;
    // Only update if the value is empty or a positive number
    if (value === '' || (Number(value) >= 0 && !isNaN(Number(value)))) {
      setAmountA(value);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8 h-[700px] overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl rounded-xl p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-white tracking-tight">
          Swap Tokens
        </h2>
        <div className="space-y-6">
          {/* Sell Token */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sell</label>
            <select
              value={selectedTokenA}
              onChange={(e) => setSelectedTokenA(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            >
              <option value="">Select Token</option>
              {userTokens.map((token) => (
                <option key={token.mint} value={token.mint} disabled={token.mint === selectedTokenB}>
                  {token.name} ({token.symbol}) - Balance: {token.balance}
                </option>
              ))}
            </select>
          </div>
          {/* Sell Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
            <input
              type="number"
              value={amountA}
              onChange={handleAmountAChange}
              min="0"
              step="any"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              placeholder="Enter amount to swap"
            />
          </div>
          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapInputs}
              className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-300"
            >
              <SwapOutlined className="text-white text-2xl" />
            </button>
          </div>
          {/* Buy Token */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Buy</label>
            <select
              value={selectedTokenB}
              onChange={(e) => setSelectedTokenB(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            >
              <option value="">Select Token</option>
              {userTokens.map((token) => (
                <option key={token.mint} value={token.mint} disabled={token.mint === selectedTokenA}>
                  {token.name} ({token.symbol})
                </option>
              ))}
            </select>
          </div>
          {/* Receive Amount */}
          {selectedTokenA && selectedTokenB && amountA && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">You will receive</label>
              {calculatingAmountB ? (
                <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  Calculating...
                </div>
              ) : amountB === null ? (
                <p className="text-sm text-red-400">No liquidity pool present for this token pair.</p>
              ) : (
                <input
                  type="text"
                  value={`${amountB.toFixed(6)} ${userTokens.find((t) => t.mint === selectedTokenB)?.symbol || ''}`}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              )}
            </div>
          )}
          {/* Swap Tokens Button */}
          <button
            onClick={handleSwap}
            disabled={loading || calculatingAmountB || amountB === null}
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-blue-500 transition duration-300 ${loading || calculatingAmountB || amountB === null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Swapping...' : calculatingAmountB ? 'Calculating...' : 'Swap Tokens'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;
