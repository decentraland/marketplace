import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { ESTATE_REGISTRY_ADDRESS } from '../../../modules/contracts'
import { NFT } from '../types'
import { EstateRegistry } from '../../../contracts/EstateRegistry'

export const getSelection = (nft: NFT) => {
  return nft.estate!.parcels.map(pair => ({
    x: +pair.x,
    y: +pair.y
  }))
}

export const getCenter = (selection: { x: number; y: number }[]) => {
  const xs = [...new Set(selection.map(coords => coords.x).sort())]
  const ys = [...new Set(selection.map(coords => coords.y).sort())]
  const x = xs[(xs.length / 2) | 0]
  const y = ys[(ys.length / 2) | 0]
  return [x, y]
}

export async function getFingerprint(estateId: string) {
  const eth = Eth.fromCurrentProvider()
  if (eth) {
    const estateRegistry = new EstateRegistry(
      eth,
      Address.fromString(ESTATE_REGISTRY_ADDRESS)
    )
    return estateRegistry.methods.getFingerprint(estateId).call()
  }
}
