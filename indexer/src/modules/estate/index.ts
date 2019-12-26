import { NFT, Estate } from '../../entities/schema'

export function buildEstateFromNFT(nft: NFT): Estate {
  let estate = new Estate(nft.id)

  estate.tokenId = nft.tokenId
  estate.owner = nft.owner
  estate.parcels = []
  estate.size = 0

  return estate
}
