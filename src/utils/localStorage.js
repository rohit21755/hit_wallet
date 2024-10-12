
export const saveWalletData = (encryptedPhrase, passwordHash) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletData', JSON.stringify({
        encryptedPhrase,
        passwordHash 
      }));
    }
  };
  export const getWalletData = () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('walletData');
      if (data) {
        return JSON.parse(data);
      }
    }
    return null;
  };

  export const clearWalletData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletData');
    }
  };
  



  
//   import { decryptSecret } from '../utils/encryption';
//   import { getWalletData } from '../utils/localStorage';
  
//   const handleLogin = (password) => {
//     const walletData = getWalletData();
  
//     if (walletData) {
//       const { encryptedPhrase, noOfAccounts } = walletData;
      
//       // Decrypt the phrase using the password
//       const decryptedPhrase = decryptSecret(encryptedPhrase, password);
  
//       if (decryptedPhrase) {
//         console.log('Decrypted Secret Phrase:', decryptedPhrase);
//         console.log('Number of Accounts:', noOfAccounts);
//       } else {
//         console.error('Invalid password or decryption failed');
//       }
//     } else {
//       console.error('No wallet data found');
//     }
//   };
  