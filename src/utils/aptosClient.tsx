import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

import { NEXT_PUBLIC_APTOS_NETWORK, NEXT_PUBLIC_APTOS_NODE } from '@/utils/env';

export function getAptosClient() {
  let network = Network.TESTNET;

  switch (NEXT_PUBLIC_APTOS_NETWORK) {
    case 'mainnet':
      network = Network.MAINNET;
      break;
    case 'devnet':
      network = Network.DEVNET;
      break;
    case 'testnet':
      network = Network.TESTNET;
      break;
    case 'custom':
      network = Network.TESTNET;
      break;
  }

  const config = new AptosConfig({
    network: network,
    fullnode:
      NEXT_PUBLIC_APTOS_NETWORK == 'custom'
        ? NEXT_PUBLIC_APTOS_NODE
        : undefined,
  });
  return new Aptos(config);
}
