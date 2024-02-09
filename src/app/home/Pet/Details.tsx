'use client';

import { AiFillSave } from 'react-icons/ai';
import { FaCopy } from 'react-icons/fa';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  InputTransactionData,
  useWallet,
} from '@aptos-labs/wallet-adapter-react';

import { NEXT_PUBLIC_CONTRACT_ADDRESS } from '@/utils/env';
import { getAptosClient } from '@/utils/aptosClient';
import { HealthBar } from '@/components/HealthBar';
import { Pet } from '.';
import { shortenWalletAddress } from '@/utils/shortenWalletAddress';

export interface PetDetailsProps {
  pet: Pet;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
}

const aptosClient = getAptosClient();

export function PetDetails({ pet, setPet }: PetDetailsProps) {
  const [newName, setNewName] = useState(pet.name);
  useState<boolean>(false);
  const { account, network, signAndSubmitTransaction } = useWallet();

  const owner = account?.ansName
    ? `${account?.ansName}.apt`
    : account?.address || '';

  const canSave = newName !== pet.name;

  const handleNameChange = async () => {
    if (!account || !network) return;

    const transaction: InputTransactionData = {
      data: {
        function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::set_name`,
        typeArguments: [],
        functionArguments: [newName],
      },
    };

    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptosClient.waitForTransaction({ transactionHash: response.hash });

      setPet((pet) => {
        if (!pet) return pet;
        return { ...pet, name: newName };
      });
    } catch (error: any) {
      console.error(error);
    } finally {
    }
  };

  const handleCopyOwnerAddrOrName = () => {
    navigator.clipboard.writeText(owner);
  };

  const nameFieldComponent = (
    <div className='nes-field'>
      <label htmlFor='name_field'>Name</label>
      <div className='relative'>
        <input
          type='text'
          id='name_field'
          className='nes-input'
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
        <button
          className='absolute right-4 top-1/2 -translate-y-1/2 nes-pointer disabled:cursor-not-allowed text-sky-500 disabled:text-gray-400'
          disabled={!canSave}
          onClick={handleNameChange}
        >
          <AiFillSave className=' h-8 w-8 drop-shadow-sm' />
        </button>
      </div>
    </div>
  );

  const ownerFieldComponent = (
    <div className='nes-field'>
      <label htmlFor='owner_field'>Owner</label>
      <div className='relative'>
        <input
          type='text'
          id='owner_field'
          className='nes-input pr-12'
          disabled
          value={shortenWalletAddress(owner, 6)}
        />
        <button
          className='absolute right-4 top-1/2 -translate-y-1/2 nes-pointer disabled:cursor-not-allowed text-gray-400 disabled:text-gray-400'
          onClick={handleCopyOwnerAddrOrName}
        >
          <FaCopy className='h-8 w-8 drop-shadow-sm' />
        </button>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col'>
        <label>Energy Points</label>
        <HealthBar
          totalHealth={10}
          currentHealth={pet.energy_points}
          icon='star'
        />
      </div>
      <div className='flex flex-col gap-2'>
        {nameFieldComponent}
        {ownerFieldComponent}
        <br />
      </div>
    </div>
  );
}
