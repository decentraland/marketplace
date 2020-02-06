import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { NFT, ENS } from '../../entities/schema'

export function buildENSFromNFT(nft: NFT): ENS {
  let ens = new ENS(nft.id)

  ens.tokenId = nft.tokenId
  ens.owner = nft.owner

  return ens
}

export function getTokenIdFromLabelHash(labelHash: Bytes): BigInt {
  // .reverse() changes the array! we need to change it back
  labelHash.reverse()
  let tokenId = BigInt.fromUnsignedBytes(labelHash)
  labelHash.reverse()

  return tokenId
}
