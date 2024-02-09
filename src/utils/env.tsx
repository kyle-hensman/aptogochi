export const NEXT_PUBLIC_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  '0xcab918f5f28bab478e237cd15c3750b3fa3f95ec0505510a24aa663efb348dd3';
export const NEXT_PUBLIC_BODY_OPTIONS =
  process.env.NEXT_PUBLIC_BODY_OPTIONS || 5;
export const NEXT_PUBLIC_EAR_OPTIONS = process.env.NEXT_PUBLIC_EAR_OPTIONS || 6;
export const NEXT_PUBLIC_FACE_OPTIONS =
  process.env.NEXT_PUBLIC_FACE_OPTIONS || 4;
export const NEXT_PUBLIC_ENERGY_INCREASE =
  process.env.NEXT_PUBLIC_ENERGY_INCREASE || 2;
export const NEXT_PUBLIC_ENERGY_DECREASE =
  process.env.NEXT_PUBLIC_ENERGY_DECREASE || 2;
export const NEXT_PUBLIC_ENERGY_CAP = process.env.NEXT_PUBLIC_ENERGY_CAP || 10;
export const NEXT_PUBLIC_APTOS_NETWORK =
  process.env.NEXT_PUBLIC_APTOS_NETWORK || 'testnet';
export const NEXT_PUBLIC_APTOS_NODE =
  process.env.NEXT_PUBLIC_APTOS_NODE || undefined;
