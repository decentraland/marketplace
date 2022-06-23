import { NFTCategory } from '@dcl/schemas'
import {
  getSigner,
  getConnectedProvider
} from 'decentraland-dapps/dist/lib/eth'
import { EstateRegistry__factory } from '../../../contracts'
import { getContract } from '../../contract/utils'
import { NFT } from '../types'

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
    const estate = getContract({ category: NFTCategory.ESTATE })
    const estateRegistry = EstateRegistry__factory.connect(
      estate.address,
      await getSigner()
    )
    return estateRegistry.getFingerprint(estateId)
  }
}
