import { collectionAPI } from '../../../modules/vendor/decentraland'

export async function getCollectionByAddress(address: string) {
  const { data } = await collectionAPI.fetch({
    contractAddress: address
  })

  return data[0]
}

