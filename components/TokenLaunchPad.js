import { useContext, useState } from "react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  useConnection,
  useWallet,
  WalletContext,
} from "@solana/wallet-adapter-react";
import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import pinataWeb3 from "../helper/pinataWeb3";
import { Spin } from "antd";
import { toast } from 'react-toastify';

const TokenLaunchPad = () => {
  const { connected } = useContext(WalletContext);
  const { connection } = useConnection();
  const wallet = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [supply, setSupply] = useState("");
  const [decimals, setDecimals] = useState("9");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeInBytes = 204800;
      if (file.size > maxSizeInBytes) {
        toast.error("File is too large. Max size is 200KB.");
        console.log("File is too large. Max size is 200KB.");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    } else {
      toast.error("File is too large. Max size is 200KB.");
    }
  };

  const launchToken = async () => {
    try {
      setLoading(true);
      const web3ImageUpload = await pinataWeb3.upload.file(selectedFile);
      console.log(web3ImageUpload);
      let imageUrl = `https://gateway.pinata.cloud/ipfs/${web3ImageUpload.IpfsHash}`;
      console.log(imageUrl);
      const mintKeypair = Keypair.generate();
      const associatedToken = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      let external_metadata = {
        name: name,
        symbol: symbol,
        description: "This is a test token",
        image: imageUrl,
      };
      let pinataRes = await pinataWeb3.upload.json(external_metadata);
      let uri = `https://gateway.pinata.cloud/ipfs/${pinataRes.IpfsHash}`;
      console.log(uri)
      const metadata = {
        mint: mintKeypair.publicKey,
        name: name,
        symbol: symbol,
        uri: uri,
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          Number(decimals),
          wallet.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        }),
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedToken,
          wallet.publicKey,
          Number(supply) * Math.pow(10, decimals),
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.partialSign(mintKeypair);

      await wallet.sendTransaction(transaction, connection);
      setName("");
      setSymbol("");
      setSupply("");
      setDecimals("");
      setSelectedFile(null);
      setLoading(false);
      toast.success("Token Launched Successfully");
    } catch (error) {
      console.log(error);
      setName("");
      setSymbol("");
      setSupply("");
      setDecimals("");
      setSelectedFile(null);
      setLoading(false);
      notification.error(error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8 h-[700px] overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl rounded-xl p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-white tracking-tight">
          Create your Own Token
        </h2>
        <div className="space-y-6">
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base placeholder-gray-400"
            value={name}
            type="text"
            placeholder="Token Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base placeholder-gray-400"
            value={symbol}
            type="text"
            placeholder="Token Symbol"
            onChange={(e) => setSymbol(e.target.value)}
          />
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base placeholder-gray-400"
            value={supply}
            type="number"
            min="0"
            step="any"
            placeholder="Token Supply"
            onChange={(e) => setSupply(e.target.value)}
          />
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base placeholder-gray-400"
            value={decimals}
            type="number"
            placeholder="Token Decimals (max 9)"
            onChange={(e) => {
              if (Number(e.target.value) > 9) {
                toast.error("Decimals should be less than 9");
                return;
              }
              setDecimals(e.target.value);
            }}
          />
          <div className="flex items-center justify-center">
            <label htmlFor="file-upload" className="cursor-pointer group">
              {selectedFile ? (
                <img
                  className="h-20 w-20 object-cover rounded-full border-2 border-blue-500 shadow-md"
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                />
              ) : (
                <div className="bg-gray-700 text-gray-300 rounded-lg px-5 py-3 sm:px-6 sm:py-3 text-base hover:bg-gray-600 hover:text-white transition duration-300 flex items-center justify-center">
                  Upload Image
                </div>
              )}
            </label>
            <input
              id="file-upload"
              className="hidden"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <button
            onClick={launchToken}
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-blue-500 transition duration-300 text-base ${!connected || loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={!connected || loading}
          >
            {loading ? 'Launching...' : 'Launch Token'}
          </button>
        </div>
        {loading && (
          <div className="mt-6 flex justify-center">
            <Spin size="large" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenLaunchPad;