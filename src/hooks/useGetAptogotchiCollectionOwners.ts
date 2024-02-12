import { useCallback, useState } from 'react';
import { getAptosClient } from '@/utils/aptosClient';
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from '@/utils/env';

import { queryAptogotchiCollection } from '@/graphql/queryAptogotchiCollection';
import { padAddressIfNeeded } from '@/utils/address';

const aptosClient = getAptosClient();

type Collection = {
  collection_id: string;
  collection_name: string;
  creator_address: string;
  uri: string;
  current_supply: any;
};

type CollectionHolder = {
  owner_address: string;
};

type CollectionResponse = {
  current_collections_v2: Collection[];
  current_collection_ownership_v2_view: CollectionHolder[];
};

export function useGetAptogotchiCollectionOwners() {
  const [owners, setOwners] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOwners = useCallback(async () => {
    try {
      setLoading(true);

      const aptogotchiCollectionIDResponse = (await aptosClient.view({
        payload: {
          function: `${NEXT_PUBLIC_CONTRACT_ADDRESS}::main::get_aptogotchi_collection_id`,
        },
      })) as [`0x${string}`];

      const collectionIDAddr = padAddressIfNeeded(
        aptogotchiCollectionIDResponse[0]
      );

      const collectionResponse: CollectionResponse =
        await aptosClient.queryIndexer({
          query: {
            query: queryAptogotchiCollection,
            variables: {
              collection_id: collectionIDAddr,
            },
          },
        });

      const foundOwners = await Promise.all(
        collectionResponse.current_collection_ownership_v2_view.map(
          (holder) => {
            return holder.owner_address as string;
          }
        )
      );

      setOwners(foundOwners);
    } catch (error) {
      console.error('Error fetching Aptogotchi owners:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { owners, loading, fetchOwners };
}
