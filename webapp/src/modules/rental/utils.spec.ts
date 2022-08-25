import { NFT, RentalListing, RentalListingPeriod } from '@dcl/schemas'
import { BigNumber, ethers } from 'ethers'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { ChainId } from '@dcl/schemas'
import { Asset } from '../asset/types'
import {
  getAssetNonce,
  getContractNonce,
  getNonces,
  getSignature,
  getSignerNonce,
  getOpenRentalId,
  getMaxPriceOfPeriods
} from './utils'
import { getRentalsContractInstance } from './contract'

jest.mock('decentraland-dapps/dist/lib/eth')
jest.mock('./contract')

const getSignerMock = getSigner as jest.MockedFunction<typeof getSigner>
const signerMock = {
  getAddress: jest.fn(),
  _signTypedData: jest.fn()
}
const getRentalsContractInstanceMock = getRentalsContractInstance as jest.MockedFunction<
  typeof getRentalsContractInstance
>
const rentalsMock = ({
  contractNonce: jest.fn(),
  assetNonce: jest.fn(),
  signerNonce: jest.fn()
} as unknown) as ethers.Contract

describe('when getting a signature', () => {
  describe('and can not get the signer', () => {
    let error: Error
    beforeEach(() => {
      error = new Error('Some error')
      getSignerMock.mockRejectedValueOnce(error)
    })
    it('should throw an error', () => {
      return expect(
        getSignature(
          ChainId.ETHEREUM_GOERLI,
          '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
          '27562871720596015540533343201973225127790',
          ['0', '0', '0'],
          [{ pricePerDay: '1000000000000000000', minDays: 7, maxDays: 7 }],
          1976562675847
        )
      ).rejects.toThrowError(error)
    })
  })
  describe('and the signer can be retrieved', () => {
    beforeEach(() => {
      getSignerMock.mockResolvedValueOnce(
        (signerMock as unknown) as ethers.providers.JsonRpcSigner
      )
    })
    describe('and can not get the address', () => {
      let error: Error
      beforeEach(() => {
        error = new Error('Some error')
        signerMock.getAddress.mockRejectedValueOnce(error)
      })
      it('should throw an error', () => {
        return expect(
          getSignature(
            ChainId.ETHEREUM_GOERLI,
            '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
            '27562871720596015540533343201973225127790',
            ['0', '0', '0'],
            [{ pricePerDay: '1000000000000000000', minDays: 7, maxDays: 7 }],
            1976562675847
          )
        ).rejects.toThrowError(error)
      })
    })
    describe('and the address can be retrieved', () => {
      beforeEach(() => {
        signerMock.getAddress.mockResolvedValueOnce(
          '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
        )
      })

      describe('and the signature fails to be generated', () => {
        let error: Error
        beforeEach(() => {
          error = new Error('Some error')
          signerMock._signTypedData.mockRejectedValueOnce(error)
        })
        it('should throw an error', () => {
          return expect(
            getSignature(
              ChainId.ETHEREUM_GOERLI,
              '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
              '27562871720596015540533343201973225127790',
              ['0', '0', '0'],
              [{ pricePerDay: '1000000000000000000', minDays: 7, maxDays: 7 }],
              1976562675847
            )
          ).rejects.toThrowError(error)
        })
      })

      describe('and the signature can be generated', () => {
        let signature: string
        beforeEach(() => {
          signature =
            '0x0f61095b6bf9660aabaffbcd382c608df9f3b2e29b5680bd969d8a7c236c8c5821d9a49c6e56f64700f5d7f8cc000b966ac58815fe0a180842890fdefeef76e81c'
          signerMock._signTypedData.mockResolvedValueOnce(signature)
        })

        it('should use the right domain, types and values and return the correct signature', async () => {
          await expect(
            getSignature(
              ChainId.ETHEREUM_GOERLI,
              '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
              '27562871720596015540533343201973225127790',
              ['0', '0', '0'],
              [{ pricePerDay: '1000000000000000000', minDays: 7, maxDays: 7 }],
              1976562675847
            )
          ).resolves.toBe(signature)
          expect(signerMock._signTypedData).toHaveBeenCalledWith(
            {
              name: 'Rentals',
              salt:
                '0x0000000000000000000000000000000000000000000000000000000000000005',
              verifyingContract: '0xbb2a03bf5f525734cb0536be4be61ba788d7ee01',
              version: '1'
            },
            {
              Listing: [
                { name: 'signer', type: 'address' },
                { name: 'contractAddress', type: 'address' },
                { name: 'tokenId', type: 'uint256' },
                { name: 'expiration', type: 'uint256' },
                { name: 'nonces', type: 'uint256[]' },
                { name: 'pricePerDay', type: 'uint256[]' },
                { name: 'maxDays', type: 'uint256[]' },
                { name: 'minDays', type: 'uint256[]' }
              ]
            },
            {
              signer: '0xb6e9c0a25aa6b10fa4fe0aa8d1097d2a6136bf98',
              contractAddress: '0x25b6b4bac4adb582a0abd475439da6730777fbf7',
              tokenId: '27562871720596015540533343201973225127790',
              expiration: '1976562675',
              nonces: ['0', '0', '0'],
              pricePerDay: ['1000000000000000000'],
              maxDays: ['7'],
              minDays: ['7']
            }
          )
        })
      })
    })
  })
})

describe('when getting the contract nonce', () => {
  beforeEach(() => {
    getRentalsContractInstanceMock.mockResolvedValueOnce(rentalsMock)
    rentalsMock.contractNonce.mockResolvedValueOnce(BigNumber.from(0))
  })
  it('should return the contract nonce and use the right chain id to the instance helper', async () => {
    await expect(getContractNonce(ChainId.ETHEREUM_GOERLI)).resolves.toBe('0')
    expect(getRentalsContractInstanceMock).toHaveBeenCalledWith(
      ChainId.ETHEREUM_GOERLI
    )
    expect(rentalsMock.contractNonce).toHaveBeenCalled()
  })
})

describe('when getting the asset nonce', () => {
  beforeEach(() => {
    getRentalsContractInstanceMock.mockResolvedValueOnce(rentalsMock)
    rentalsMock.assetNonce.mockResolvedValueOnce(BigNumber.from(0))
  })
  it('should return the asset nonce and use the correct chain id, contract address, token id and signer address', async () => {
    await expect(
      getAssetNonce(
        ChainId.ETHEREUM_GOERLI,
        '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
        '27562871720596015540533343201973225127790',
        '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
      )
    ).resolves.toBe('0')
    expect(getRentalsContractInstanceMock).toHaveBeenCalledWith(
      ChainId.ETHEREUM_GOERLI
    )
    expect(rentalsMock.assetNonce).toHaveBeenCalledWith(
      '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
      '27562871720596015540533343201973225127790',
      '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
    )
  })
})

describe('when getting the signer nonce', () => {
  beforeEach(() => {
    getRentalsContractInstanceMock.mockResolvedValueOnce(rentalsMock)
    rentalsMock.signerNonce.mockResolvedValueOnce(BigNumber.from(0))
  })
  it('should return the signer nonce and use the correct chain id and signer address', async () => {
    await expect(
      getSignerNonce(
        ChainId.ETHEREUM_GOERLI,
        '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
      )
    ).resolves.toBe('0')
    expect(getRentalsContractInstanceMock).toHaveBeenCalledWith(
      ChainId.ETHEREUM_GOERLI
    )
    expect(rentalsMock.signerNonce).toHaveBeenCalledWith(
      '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
    )
  })
})

describe('when getting all the nonces', () => {
  beforeEach(() => {
    getRentalsContractInstanceMock.mockResolvedValue(rentalsMock)
    rentalsMock.contractNonce.mockResolvedValueOnce(BigNumber.from(0))
    rentalsMock.signerNonce.mockResolvedValueOnce(BigNumber.from(1))
    rentalsMock.assetNonce.mockResolvedValueOnce(BigNumber.from(2))
  })
  afterEach(() => {
    getRentalsContractInstanceMock.mockReset()
  })
  it('should return the contract nonce, signer nonce and asset nonce using the correct chain id, contract address, token id and signer address', async () => {
    await expect(
      getNonces(
        ChainId.ETHEREUM_GOERLI,
        '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
        '27562871720596015540533343201973225127790',
        '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
      )
    ).resolves.toEqual(['0', '1', '2'])
    expect(rentalsMock.contractNonce).toHaveBeenCalled()
    expect(rentalsMock.signerNonce).toHaveBeenCalledWith(
      '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
    )
    expect(rentalsMock.assetNonce).toHaveBeenCalledWith(
      '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
      '27562871720596015540533343201973225127790',
      '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
    )
  })
})

describe('when getting the open rental id from an asset', () => {
  let asset: Asset

  describe('and the open rental id is set', () => {
    beforeEach(() => {
      asset = {
        id: 'someAssetId',
        openRentalId: 'aRentalId'
      } as Asset
    })

    it('should return the open rental id', () => {
      expect(getOpenRentalId(asset)).toBe((asset as NFT).openRentalId)
    })
  })

  describe('and the open rental id is not set', () => {
    beforeEach(() => {
      asset = {
        id: 'someAssetId'
      } as Asset
    })

    it('should return null', () => {
      expect(getOpenRentalId(asset)).toBe(null)
    })
  })
})

describe('when getting the max price per day of the periods of a rental', () => {
  let rentalListing: RentalListing

  beforeEach(() => {
    rentalListing = {
      periods: [] as RentalListingPeriod[]
    } as RentalListing
  })

  describe('and all periods have their price per day equal to zero', () => {
    beforeEach(() => {
      rentalListing = {
        ...rentalListing,
        periods: [
          { maxDays: 10, minDays: 10, pricePerDay: '0' },
          { maxDays: 20, minDays: 20, pricePerDay: '0' }
        ]
      }
    })

    it('should return 0', () => {
      expect(getMaxPriceOfPeriods(rentalListing)).toBe('0')
    })
  })

  describe('and all periods hav e different prices', () => {
    beforeEach(() => {
      rentalListing = {
        ...rentalListing,
        periods: [
          { maxDays: 10, minDays: 10, pricePerDay: '10000' },
          { maxDays: 20, minDays: 20, pricePerDay: '20000' }
        ]
      }
    })

    it('should return the most expensive period', () => {
      expect(getMaxPriceOfPeriods(rentalListing)).toBe('20000')
    })
  })
})
