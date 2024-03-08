import { getSigner, getConnectedProvider, getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { EstateRegistry__factory } from '../../../contracts'
import { Contract } from '../../vendor/services'
import { NFT } from '../types'
import { ethers } from 'ethers'

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

export async function generateFingerprint(estateId: string, parcels: { x: number; y: number }[], landContract: Contract) {
  const provider = await getNetworkProvider(landContract.chainId)
  const contract = new ethers.Contract(
    landContract.address,
    [
      {
        constant: true,
        inputs: [
          { name: 'x', type: 'int256' },
          { name: 'y', type: 'int256' }
        ],
        name: 'encodeTokenId',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
      }
    ],
    new ethers.providers.Web3Provider(provider)
  )

  const estateTokenIds = []

  for (const parcel of parcels) {
    estateTokenIds.push(await contract.encodeTokenId(parcel.x, parcel.y))
  }

  let fingerprint = BigInt(ethers.utils.solidityKeccak256(['string', 'uint256'], ['estateId', estateId]))

  for (const tokenId of estateTokenIds) {
    fingerprint ^= BigInt(ethers.utils.solidityKeccak256(['uint256'], [tokenId]))
  }

  return ethers.utils.hexlify(fingerprint)
}

export async function getFingerprint(estateId: string, estateContract: Contract) {
  const provider = await getConnectedProvider()
  if (provider) {
    const estateRegistry = EstateRegistry__factory.connect(estateContract.address, await getSigner())
    return estateRegistry.getFingerprint(estateId)
  }
}
