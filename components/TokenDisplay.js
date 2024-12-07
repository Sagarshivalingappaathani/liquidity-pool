"use client";
import React, { useState, useEffect } from "react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getMint,
  getTokenMetadata,
  NATIVE_MINT,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const UserTokens = () => {
  const { connection } = useConnection();
  const walletContext = useWallet();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!walletContext.publicKey) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch SOL balance
        const solBalance = await connection.getBalance(walletContext.publicKey);
        const SOL_MINT = NATIVE_MINT;
        const solToken = {
          mint: SOL_MINT.toBase58(),
          balance: solBalance / LAMPORTS_PER_SOL,
          symbol: "SOL",
          name: "Solana",
          image:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          programId: TOKEN_PROGRAM_ID,
        };

        // Fetch SPL tokens (standard + TOKEN_2022)
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          walletContext.publicKey,
          {
            programId: TOKEN_PROGRAM_ID,
          }
        );
        const token2022Accounts = await connection.getParsedTokenAccountsByOwner(
          walletContext.publicKey,
          {
            programId: TOKEN_2022_PROGRAM_ID,
          }
        );

        // Combine all token accounts
        let allTokenAccounts = [
          ...tokenAccounts.value.map((token) => ({
            ...token,
            programId: TOKEN_PROGRAM_ID,
          })),
          ...token2022Accounts.value.map((token) => ({
            ...token,
            programId: TOKEN_2022_PROGRAM_ID,
          })),
        ];

        // Fetch token details
        const tokensPromises = allTokenAccounts.map(async (accountInfo) => {
          const mintAddress = accountInfo.account.data.parsed.info.mint;
          const balance = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;

          if (balance === 0) return null; // Skip zero-balance tokens

          try {
            const mintInfo = await getMint(
              connection,
              new PublicKey(mintAddress),
              "confirmed",
              accountInfo.programId
            );
            let tokenMetadata = null;
            if (accountInfo.programId === TOKEN_2022_PROGRAM_ID) {
              tokenMetadata = await getTokenMetadata(
                connection,
                new PublicKey(mintAddress),
                "confirmed",
                accountInfo.programId
              );
              const uriDetails = await fetch(tokenMetadata.uri);
              const metadata = await uriDetails.json();
              return {
                mint: mintAddress,
                balance,
                symbol: metadata.symbol,
                name: metadata.name,
                image: metadata.image,
              };
            } else {
              return {
                mint: mintAddress,
                balance,
                symbol: "Unknown",
                name: `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
                image: "",
              };
            }
          } catch (error) {
            console.error(`Error fetching metadata for token ${mintAddress}:`, error);
            return {
              mint: mintAddress,
              balance,
              symbol: "Unknown",
              name: `Token ${mintAddress.slice(0, 4)}...${mintAddress.slice(-4)}`,
              image: "",
            };
          }
        });

        const tokens = await Promise.all(tokensPromises);
        const validTokens = [solToken, ...tokens.filter((token) => token !== null)];
        setTokens(validTokens);
      } catch (err) {
        console.error("Error fetching tokens:", err);
        setError("Failed to fetch token data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (walletContext.publicKey) {
      fetchTokens();
    }
  }, [walletContext.publicKey, connection]);

  return (
    <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6 ">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">
        User Tokens
      </h2>
      {loading && <p className="text-gray-300 text-center">Loading tokens...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && tokens.length === 0 && (
        <p className="text-gray-300 text-center">
          No tokens found for the provided address.
        </p>
      )}
      {!loading && !error && tokens.length > 0 && (
        <table className="table-fixed w-full bg-gray-700 rounded-lg">
          <thead>
            <tr className="text-white">
              <th className="w-16 px-4 py-4 text-left">Image</th>
              <th className="w-1/4 px-4 py-4 text-left">Name</th>
              <th className="w-1/6 px-4 py-4 text-left">Symbol</th>
              <th className="w-1/6 px-4 py-4 text-left">Balance</th>
              <th className="w-1/3 px-4 py-4 text-left">Mint Address</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr
                key={index}
                className={`border-b border-gray-600 ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                }`}
              >
                <td className="px-4 py-4">
                  {token.image ? (
                    <img
                      src={token.image}
                      alt={token.symbol}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="px-4 py-4 text-white">{token.name}</td>
                <td className="px-4 py-4 text-gray-300">{token.symbol}</td>
                <td className="px-4 py-4 text-gray-300">
                  {token.balance.toFixed(6)}
                </td>
                <td className="px-4 py-4 text-gray-300 break-words">
                  {token.mint}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTokens;
