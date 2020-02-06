import { NFT, ENS } from '../../entities/schema'

export function buildENSFromNFT(nft: NFT): ENS {
  let ens = new ENS(nft.id)

  ens.tokenId = nft.tokenId
  ens.owner = nft.owner

  return ens
}
