import { renderHook } from '@testing-library/react-hooks'
import { ChainId, NFTCategory, Network } from '@dcl/schemas'
import { useSelector } from 'react-redux'
import { RootState } from '../reducer'
import { VendorName } from '../vendor'
import { generateFingerprint, getFingerprint } from './estate/utils'
import { useFingerprint } from './hooks'
import { NFT } from './types'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}))

jest.mock('./estate/utils', () => ({
  generateFingerprint: jest.fn(),
  getFingerprint: jest.fn()
}))

let nft: NFT

describe('when the nft is not an estate', () => {
  beforeEach(() => {
    nft = {
      id: 'test-id',
      category: NFTCategory.PARCEL
    } as NFT
  })

  it('should return fingerprint as undefiend', () => {
    const { result } = renderHook(() => useFingerprint(nft))
    const [fingerprint] = result.current
    expect(fingerprint).toBe(undefined)
  })

  it('should return contractFingerprint as undefined', () => {
    const { result } = renderHook(() => useFingerprint(nft))
    const [, , contractFingerprint] = result.current
    expect(contractFingerprint).toBe(undefined)
  })

  it('should return loading as false', () => {
    const { result } = renderHook(() => useFingerprint(nft))
    const [, isLoading] = result.current
    expect(isLoading).toBe(false)
  })
})

describe('when the nft is an estate', () => {
  let fingerprint: string
  let contractFingerprint: string

  beforeEach(() => {
    nft = {
      id: 'estate-id',
      tokenId: 'estate-id',
      category: NFTCategory.ESTATE,
      data: {
        estate: {
          size: 2,
          description: 'estate desc',
          parcels: [
            { x: 1, y: 1 },
            { x: 1, y: 2 }
          ]
        }
      }
    } as NFT

    const appData: Partial<RootState> = {
      tile: {
        data: {
          '1,1': {
            x: 1,
            y: 1,
            type: 1,
            owner: 'test',
            estate_id: 'estate-id'
          }
        },
        lastModified: null,
        loading: [],
        error: null
      },
      contract: {
        loading: [],
        error: null,
        hasFetched: false,
        data: [
          {
            name: 'estate',
            chainId: ChainId.ETHEREUM_SEPOLIA,
            address: 'add',
            network: Network.ETHEREUM,
            vendor: VendorName.DECENTRALAND,
            category: NFTCategory.ESTATE
          }
        ]
      }
    }

    ;(useSelector as jest.Mock).mockImplementation((callback: (appData: unknown) => unknown) => callback(appData))

    fingerprint = '0x123123'
    contractFingerprint = '0x456456'
    ;(generateFingerprint as jest.Mock).mockResolvedValue(fingerprint)
    ;(getFingerprint as jest.Mock).mockResolvedValue(contractFingerprint)
  })
  it('should return calculated fingerprint of parcels', async () => {
    const { result, waitFor } = renderHook(() => useFingerprint(nft))
    await waitFor(() => expect(result.current[1]).toBe(false))
    expect(result.current[0]).toEqual(fingerprint)
  })

  it('should return contract fingerprint', async () => {
    const { result, waitFor } = renderHook(() => useFingerprint(nft))
    await waitFor(() => expect(result.current[1]).toBe(false))
    expect(result.current[2]).toEqual(contractFingerprint)
  })
})
