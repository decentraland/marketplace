import { collectionAPI } from "../../../../../modules/vendor/decentraland"

export async function getCollectionNameByAddress(address: string, onlyOnSale: boolean | undefined) {
  const { data } = await collectionAPI.fetch({
    contractAddress: address,
    isOnSale: onlyOnSale
  })

  if (data.length === 0) {
    return undefined
  }

  return data[0].name
}
