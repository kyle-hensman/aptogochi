'use client';

import { useState, useEffect, useCallback } from 'react';

import { NEXT_PUBLIC_CONTRACT_ADDRESS } from '@/utils/env';
import { getAptosClient } from '@/utils/aptosClient';
import { shortenWalletAddress } from '@/utils/shortenWalletAddress';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useGetAptogotchiCollectionOwners } from '@/hooks/useGetAptogotchiCollectionOwners';
// import { Modal } from '@/components/Modal';

// const TESTNET_ID = '2';

const aptosClient = getAptosClient();

export interface Players {
  name: string;
  rank: number;
  experience: number;
  owner: string;
}

export function Leaderboard() {
  const { owners, loading, fetchOwners } = useGetAptogotchiCollectionOwners();
  const [players, setPlayers] = useState<Array<Players>>([]);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  const fetchPlayers = useCallback(async () => {
    const foundPlayers: Array<Players> = [];

    for (let index = 0; index < owners.length; index++) {
      const player = owners[index];

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

    setPlayers(foundPlayers);
  }, [owners]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return (
    <div className='flex flex-col gap-3 p-3'>
      <h1>Leaderboards</h1>
      <div className='p-4 bg-green-500 rounded overflow-scroll h-[55vh]'>
        {!loading && !players ? (
          <div className='flex justify-center items-center h-[55vh]'>
            <h2 className='text-2xl text-white animate-pulse'>Loading...</h2>
          </div>
        ) : (
          players &&
          players.length > 0 && (
            <div className='table'>
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
