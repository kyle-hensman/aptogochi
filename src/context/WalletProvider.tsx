'use client';

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { PropsWithChildren } from 'react';

const listOfWallets = [new PetraWallet()];

export const wallets = [...listOfWallets];

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {
        console.log('Error: ', error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
