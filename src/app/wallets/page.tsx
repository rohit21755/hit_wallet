"use client";
import { mnemonicToSeedSync } from 'bip39';
import { useState, useEffect } from 'react';
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Wallet, HDNodeWallet } from 'ethers';
import { getWalletData } from '@/utils/localStorage';
import { decryptSecret } from '@/utils/encryption';

interface Wallets {
  publicKey: string;
  privateKey: string;
}

export default function Wallets() {
  const [num, setNum] = useState<number>(0); 
  const [solWallets, setSolWallets] = useState<Wallets[]>([]); 
  const [ethWallets, setEthWallets] = useState<Wallets[]>([]);
  const [seed, setSeed] =  useState<string | null>(null);  

  // Fetch the seed on mount
  useEffect(() => {
    const temp = getWalletData();
    const newSeed = decryptSecret(temp.encryptedPhrase, 'rohit0902');
    console.log("checking seed",newSeed)
    setSeed(newSeed);  
    const storedNum = localStorage.getItem('numOfWallets');

    if (storedNum) {
      setNum(parseInt(storedNum, 10));
    }
  }, []);
  useEffect(() => {
    if (seed && num > solWallets.length) {
      createMultipleSolWallets(num - solWallets.length); 
      createMultipleEthWallets(num - ethWallets.length);
    }
  }, [num, seed]);

  const createSolWallet = () => {
    if (!seed) return; 

    const path = `m/44'/501'/${solWallets.length}'/0'`;
    const derivedSeed = derivePath(path, seed.toString()).key;
    const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
    const secret = Keypair.fromSecretKey(keyPair.secretKey).secretKey;
    const publicKey = Keypair.fromSecretKey(keyPair.secretKey).publicKey.toBase58();

    const newWallet: Wallets = {
      publicKey,
      privateKey: Buffer.from(secret).toString('hex'), 
    };
    setSolWallets((prevWallets) => [...prevWallets, newWallet]);
  };

  const createMultipleSolWallets = (count: number) => {
    if (!seed) return;  

    const walletsToAdd: Wallets[] = [];
    for (let i = solWallets.length; i < solWallets.length + count; i++) {
      const path = `m/44'/501'/${i}'/0'`;
      const derivedSeed = derivePath(path, seed.toString()).key;
      const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
      const secret = Keypair.fromSecretKey(keyPair.secretKey).secretKey;
      const publicKey = Keypair.fromSecretKey(keyPair.secretKey).publicKey.toBase58();

      walletsToAdd.push({
        publicKey,
        privateKey: Buffer.from(secret).toString('hex'),
      });
    }
    setSolWallets((prevWallets) => [...prevWallets, ...walletsToAdd]);
  };

  const createEthWallet = () => {
    if (!seed) return;  

    const derivationPath = `m/44'/60'/${ethWallets.length}'/0/0`; 
    
    const hdNode = HDNodeWallet.fromSeed(mnemonicToSeedSync(seed));
    const childNode = hdNode.derivePath(derivationPath);
    const privateKey = childNode.privateKey; 
    const wallet = new Wallet(privateKey); 
    
    const newWallet: Wallets = {
      publicKey: wallet.address, 
      privateKey: privateKey,
    };
    setEthWallets((prevWallets) => [...prevWallets, newWallet]);
  };

  const createMultipleEthWallets = (count: number) => {
    if (!seed) return; 

    const walletsToAdd: Wallets[] = [];
    for (let i = ethWallets.length; i < ethWallets.length + count; i++) {
      const derivationPath = `m/44'/60'/${i}'/0/0`;
    //   const seedUint8Array = Uint8Array.from(Buffer.from(seed, 'hex'));
      const hdNode = HDNodeWallet.fromSeed(mnemonicToSeedSync(seed));
      const childNode = hdNode.derivePath(derivationPath);
      const privateKey = childNode.privateKey;
      const wallet = new Wallet(privateKey);
      
      walletsToAdd.push({
        publicKey: wallet.address,
        privateKey: privateKey,
      });
    }
    setEthWallets((prevWallets) => [...prevWallets, ...walletsToAdd]);
  };

  function handleAddWallet() {
    createEthWallet();
    createSolWallet();
    const newNum = num + 1;
    setNum(newNum);
    localStorage.setItem('numOfWallets', newNum.toString());
  }

  return (
    <div className="bg-gray-900 min-h-screen text-center text-white p-4">
      <h1>Solana Wallets</h1>
      <p>Number of Wallets Created: {num}</p>
      <button onClick={handleAddWallet} className="mt-4 p-2 bg-blue-500 rounded">
        Create New Wallet
      </button>
      <div className="mt-4">
        {solWallets.length > 0 && <h2>Generated Solana Wallets:</h2>}
        <ul>
          {solWallets.map((wallet, index) => (
            <li key={index}>
              <strong>Public Key:</strong> {wallet.publicKey}
            </li>
          ))}
        </ul>

        {ethWallets.length > 0 && <h2>Generated Ethereum Wallets:</h2>}
        <ul>
          {ethWallets.map((wallet, index) => (
            <li key={index}>
              <strong>Public Key:</strong> {wallet.publicKey}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
