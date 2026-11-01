import { Collection } from '@dcl/schemas'
import { collectionAPI } from '../../../modules/vendor/decentraland'

/**
 * Returns the collection deployed at `address`, or `undefined` when the API knows no collection there
 * (e.g. a campaign or a `?contracts=` link naming a contract that isn't an indexed collection).
 */
export async function getCollectionByAddress(address: string): Promise<Collection | undefined> {
  const { data } = await collectionAPI.fetch({
    contractAddress: address
  })

  return data[0]
}
