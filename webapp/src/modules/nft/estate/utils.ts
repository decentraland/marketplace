import { Eth } from 'web3x/eth'
import { Address } from 'web3x/address'
import { NFTCategory } from '@dcl/schemas'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { EstateRegistry } from '../../../contracts/EstateRegistry'
import { NFT } from '../types'
import { getContract } from '../../contract/utils'

export const getSelection = (estate: NFT['data']['estate']) => {
  return estate!.parcels.map(pair => ({
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
  const provider = await getConnectedProvider()
  if (provider) {
    const eth = new Eth(provider)
    const estate = getContract({ category: NFTCategory.ESTATE })
    const estateRegistry = new EstateRegistry(
      eth,
      Address.fromString(estate.address)
    )
    return estateRegistry.methods.getFingerprint(estateId).call()
  }
}
