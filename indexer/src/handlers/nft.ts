import { Transfer } from '../entities/templates/ERC721/ERC721'
import { NFT } from '../entities/schema'
import { isMint, buildId, getTokenURI } from '../modules/nft'
import { getUpdatedMetricEntity } from '../modules/metric'
import { getCategory } from '../modules/category'
import * as addresses from '../modules/contract/addresses'

import { halloween_2019 } from '../modules/wearable/halloween_2019'

export function handleTransfer(event: Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let contractAddress = event.address.toHexString()
  let category = getCategory(contractAddress)
  let id = buildId(event.params.tokenId.toString(), category)

  let nft = new NFT(id)

  nft.tokenId = event.params.tokenId
  nft.owner = event.params.to
  nft.contractAddress = event.address
  nft.category = category
  if (contractAddress != addresses.LANDRegistry) {
    // The LANDRegistry contract does not have a tokenURI method
    nft.tokenURI = getTokenURI(event)
  }

  if (contractAddress == addresses.ERC721Collection_halloween_2019) {
    for (let i = 1; i < halloween_2019.length; i++) {
      // https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/halloween_2019/wearables/funny_skull_mask/1
      let id = nft.tokenURI.split('/').slice(-2)[0]
      let wearable = halloween_2019[i]
      if (id == wearable.id) {
        nft.wearable_id = wearable.id
        nft.wearable_name = wearable.name
        nft.wearable_description = wearable.description
        nft.wearable_rarity = wearable.rarity
      }
    }
  }

  nft.save()

  if (isMint(event)) {
    // TODO: This might not be the best abstraction (`getUpdatedMetricEntity`)
    let metric = getUpdatedMetricEntity(contractAddress)
    metric.save()
  }
}
