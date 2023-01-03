import { collectionAPI } from '../../../../../modules/vendor/decentraland'

export async function getCollectionByAddress(
  address: string,
  onlyOnSale: boolean | undefined
) {
  const { data } = await collectionAPI.fetch({
    contractAddress: address,
    isOnSale: onlyOnSale
  })

  return data[0]
}
