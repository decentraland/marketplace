# Blockchain indexer

- Mainnet: https://thegraph.com/hosted-service/subgraph/decentraland/marketplace
  - Prev: `QmYXc2SCC85dvd3pL6yYfxCkLuaCvJaiES3pA4inGiGwej`
  - Curr: `QmccAwofKfT9t4XKieDqwZre1UUZxuHw5ynB35BHwHAJDT`
- Ropsten: https://thegraph.com/hosted-service/subgraph/decentraland/marketplace-ropsten
  - Prev: `QmfHCGhLTZV8v2duxDkKtPZKMEdJM7X8YGRj2UvqmrAUBB`
  - Curr: `QmZTADndoP4XRoWGVoQuaz8WTATx3UDXMn5SdE3GfkErkW`
- Goerli: https://thegraph.com/hosted-service/subgraph/decentraland/marketplace-goerli
  - Prev: `QmRNcz6TmfrFSYZcChetAiivCktGnEpAMrdRYFg74Sm9CU`
  - Curr: `Qmds1Ut7L2Kvr5Y4ZnCvpMaomcQvhq7BpjhVPgxP5TEfhT`
- Temp: https://thegraph.com/hosted-service/subgraph/decentraland/marketplace-temp
  - Prev: `QmccAwofKfT9t4XKieDqwZre1UUZxuHw5ynB35BHwHAJDT`
  - Curr: `QmYXc2SCC85dvd3pL6yYfxCkLuaCvJaiES3pA4inGiGwej`

It uses [thegraph](https://thegraph.com)

**Deploy**

```bash
npm run codegen
npm run deploy:ropsten # or deploy:mainnet
```

If a new collection in Ethereum is added you will need to add it as following

```
npx ts-node scripts/importWearableCollection.ts --collection ../../wearable-api/data/collections/{collection_name}/index.json > src/data/wearables/{collection_name}.ts
```

checkout the docs https://thegraph.com/docs/quick-start

### Queries

The collection's `id` is the smart contract address of the collection.
The item's `id` is `{collection_contract_address}-{item_blochain_id}`. The `item_blockchain_id` is the index of the item in the collection. E.g: if you have a collection with 2 items, the first is `0` and the second one is `1`. Therefore, the id of the first item will be: `{contract_address}-0`

Ethereum addresses should be passed lowercased:

- `0xB549B2442b2BD0a53795BC5cDcBFE0cAF7ACA9f8` ❌
- `0xb549b2442b2bd0a53795bc5cdcbfe0caf7aca9f8` ✅

#### Get first 5 entities for each category

```typescript
{
  parcels(first: 5) {
    id
    x
    y
    owner {
      id
    }
  }

  estates(first: 5) {
    id
    parcels {
      id
    }
    owner {
      id
    }
  }

  enss(first: 5) {
    id
    subdomain
    owner {
      id
    }
  }

  wearables(first: 5) {
    id
    owner {
      id
    }
  }
}
```

#### Get first 5 NFTs

Owner's `id` is the owner's Ethereum address.
Category could be: `parcel`, `estate`, `ens`, `wearable`

```typescript
{
  nfts(first: 5) {
    id
    category
    tokenId
    owner {
      id
    }
  }
}
```

#### Get first 5 Collection NFTs Orders

```typescript
{
  orders(first: 5) {
    id
    category
    nftAddress
    price
    buyer
    status
    nft {
      id
    }
  }
}
```
