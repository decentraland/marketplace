import { Transfer } from '../types/templates/ERC721/ERC721'
import { NFT } from '../types/schema'
import { isMint, buildId, getTokenURI } from '../modules/nft'
import { getUpdatedMetricEntity } from '../modules/metric'
import { getCategory } from '../modules/category'
import * as addresses from '../modules/contract/addresses'

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

  nft.save()

  if (isMint(event)) {
    let metric = getUpdatedMetricEntity(contractAddress)
    metric.save()
  }
}
