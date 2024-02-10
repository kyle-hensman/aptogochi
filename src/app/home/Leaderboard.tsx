'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

import { NEXT_PUBLIC_CONTRACT_ADDRESS } from '@/utils/env';
import { getAptosClient } from '@/utils/aptosClient';
import { shortenWalletAddress } from '@/utils/shortenWalletAddress';
// import { Modal } from '@/components/Modal';

// const TESTNET_ID = '2';

const aptosClient = getAptosClient();

export interface Players {
  name: string;
  rank: number;
  experience: number;
  owner: string;
}

const listOfPlayers = [
  '0x944992be51a4877ef5e7c004eda15bcb93c2a7a8c2047ac7b6517719ac30fa69',
  '0x383a98f0053202842e8fc209ba5df496ebef33cba8f8cccc1c21bbf10a6d2a54',
];

export function Leaderboard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [players, setPlayers] = useState<Array<Players>>([]);

  const fetchPlayers = useCallback(async () => {
    const foundPlayers: Array<Players> = [];

    for (let index = 0; index < listOfPlayers.length; index++) {
      const player = listOfPlayers[index];
      console.log(`getting data for ${player}`);
      setIsLoading(true);

      try {
        const [hasPet] = await aptosClient.view({
          payload: {
            function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::has_aptogotchi`,
            functionArguments: [player],
          },
        });
        if (hasPet as boolean) {
          const response = await aptosClient.view({
            payload: {
              function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi`,
              functionArguments: [player],
            },
          });
          const [name, birthday, energyPoints] = response;

          foundPlayers.push({
            name: name as string,
            rank: index + 1,
            experience:
              (energyPoints as number) * (birthday as number) + index + 1,
            owner: player,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      setPlayers(foundPlayers);
    }, 800);
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return (
    <div className='flex flex-col gap-3 p-3'>
      <h1>Leaderboards</h1>
      <div className='p-4 bg-green-500 rounded'>
        {isLoading ? (
          <div className='flex justify-center items-center h-[55vh]'>
            <h2 className='text-2xl text-white animate-pulse'>Loading...</h2>
          </div>
        ) : (
          players &&
          players.length > 0 && (
            <div className='overflow-scroll h-[55vh]'>
              <div className='nes-table-responsive'>
                <table className='nes-table is-bordered is-dark'>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Experience</th>
                      <th>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, i) => {
                      return (
                        <tr key={i}>
                          <td>{player.rank}</td>
                          <td>{player.name}</td>
                          <td>{player.experience}</td>
                          <td className='w-full'>
                            {shortenWalletAddress(player.owner, 17)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
