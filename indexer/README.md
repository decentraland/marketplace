# Blockchain indexer

It uses [thegraph](https://thegraph.com)

**Run**

```bash
npm run build-data -- --network mainnet

npm run codegen
npm run build

npm run deploy -- --network mainnet
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
