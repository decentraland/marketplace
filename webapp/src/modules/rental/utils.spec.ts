import { RentalListing, RentalListingPeriod, RentalStatus } from '@dcl/schemas'
import { BigNumber, ethers } from 'ethers'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { ChainId } from '@dcl/schemas'
import { Asset } from '../asset/types'
import { rentalsAPI } from '../vendor/decentraland/rentals/api'
import { NFT } from '../nft/types'
import {
  getAssetNonce,
  getContractNonce,
  getNonces,
  getSignature,
  getSignerNonce,
  getOpenRentalId,
  getMaxPriceOfPeriods,
  isRentalListingExecuted,
  hasRentalEnded,
  getRentalEndDate,
  getRentalChosenPeriod,
  isRentalListingOpen,
  canBeClaimed,
  isRentalListingCancelled,
  canCreateANewRental,
  waitUntilRentalChangesStatus,
  generateECDSASignatureWithValidV
} from './utils'
import { getRentalsContractInstance } from './contract'

jest.useFakeTimers()
jest.mock('decentraland-dapps/dist/lib/eth')
jest.mock('./contract')
jest.mock('../vendor/decentraland/rentals/api')
;((globalThis.setTimeout as unknown) as jest.Mock) = jest.fn()

const runTimerAutomaticallyOnce = () => {
  ;((setTimeout as unknown) as jest.Mock).mockImplementationOnce(callback =>
    callback()
  )
}

const getSignerMock = getSigner as jest.MockedFunction<typeof getSigner>
const signerMock = {
  getAddress: jest.fn(),
  _signTypedData: jest.fn()
}
const getRentalsContractInstanceMock = getRentalsContractInstance as jest.MockedFunction<
  typeof getRentalsContractInstance
>
const rentalsMock = ({
  getContractIndex: jest.fn(),
  getAssetIndex: jest.fn(),
  getSignerIndex: jest.fn()
} as unknown) as ethers.Contract
const aDay = 24 * 60 * 60 * 1000

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
              chainId:
                '0x0000000000000000000000000000000000000000000000000000000000000005',
              verifyingContract: '0x92159c78f0f4523b9c60382bb888f30f10a46b3b',
              version: '1'
            },
            {
              Listing: [
                { name: 'signer', type: 'address' },
                { name: 'contractAddress', type: 'address' },
                { name: 'tokenId', type: 'uint256' },
                { name: 'expiration', type: 'uint256' },
                { name: 'indexes', type: 'uint256[3]' },
                { name: 'pricePerDay', type: 'uint256[]' },
                { name: 'maxDays', type: 'uint256[]' },
                { name: 'minDays', type: 'uint256[]' },
                { name: 'target', type: 'address' }
              ]
            },
            {
              signer: '0xb6e9c0a25aa6b10fa4fe0aa8d1097d2a6136bf98',
              contractAddress: '0x25b6b4bac4adb582a0abd475439da6730777fbf7',
              tokenId: '27562871720596015540533343201973225127790',
              expiration: '1976562675',
              indexes: ['0', '0', '0'],
              pricePerDay: ['1000000000000000000'],
              maxDays: ['7'],
              minDays: ['7'],
              target: '0x0000000000000000000000000000000000000000'
            }
          )
        })
      })
    })
  })
})

describe('when getting the contract index', () => {
  beforeEach(() => {
    getRentalsContractInstanceMock.mockResolvedValueOnce(rentalsMock)
    rentalsMock.getContractIndex.mockResolvedValueOnce(BigNumber.from(0))
  })
  it('should return the contract nonce and use the right chain id to the instance helper', async () => {
    await expect(getContractNonce(ChainId.ETHEREUM_GOERLI)).resolves.toBe('0')
    expect(getRentalsContractInstanceMock).toHaveBeenCalledWith(
      ChainId.ETHEREUM_GOERLI
    )
    expect(rentalsMock.getContractIndex).toHaveBeenCalled()
  })
})

describe('when getting the asset nonce', () => {
  beforeEach(() => {
    getRentalsContractInstanceMock.mockResolvedValueOnce(rentalsMock)
    rentalsMock.getAssetIndex.mockResolvedValueOnce(BigNumber.from(0))
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
    expect(rentalsMock.getAssetIndex).toHaveBeenCalledWith(
      '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
      '27562871720596015540533343201973225127790',
      '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
    )
  })
})

describe('when getting the signer nonce', () => {
  beforeEach(() => {
    getRentalsContractInstanceMock.mockResolvedValueOnce(rentalsMock)
    rentalsMock.getSignerIndex.mockResolvedValueOnce(BigNumber.from(0))
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
    expect(rentalsMock.getSignerIndex).toHaveBeenCalledWith(
      '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
    )
  })
})

describe('when getting all the nonces', () => {
  beforeEach(() => {
    getRentalsContractInstanceMock.mockResolvedValue(rentalsMock)
    rentalsMock.getContractIndex.mockResolvedValueOnce(BigNumber.from(0))
    rentalsMock.getSignerIndex.mockResolvedValueOnce(BigNumber.from(1))
    rentalsMock.getAssetIndex.mockResolvedValueOnce(BigNumber.from(2))
  })
  afterEach(() => {
    getRentalsContractInstanceMock.mockReset()
  })
  it('should return the contract index, signer index and asset index using the correct chain id, contract address, token id and signer address', async () => {
    await expect(
      getNonces(
        ChainId.ETHEREUM_GOERLI,
        '0x25b6B4bac4aDB582a0ABd475439dA6730777Fbf7',
        '27562871720596015540533343201973225127790',
        '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
      )
    ).resolves.toEqual(['0', '1', '2'])
    expect(rentalsMock.getContractIndex).toHaveBeenCalled()
    expect(rentalsMock.getSignerIndex).toHaveBeenCalledWith(
      '0xB6E9c0a25aA6b10Fa4fe0AA8d1097D2A6136bf98'
    )
    expect(rentalsMock.getAssetIndex).toHaveBeenCalledWith(
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

describe('when checking if a rental is being rented', () => {
  describe('and the rental is null', () => {
    it('should return false', () => {
      expect(isRentalListingExecuted(null)).toBe(false)
    })
  })

  describe('and the rental is not null', () => {
    let rental: RentalListing
    beforeEach(() => {
      rental = {
        status: RentalStatus.EXECUTED
      } as RentalListing
    })

    Object.values(RentalStatus).forEach(rentalStatus => {
      describe(`and its status is "${rentalStatus}"`, () => {
        beforeEach(() => {
          rental.status = rentalStatus
        })

        it(`should return ${rentalStatus === RentalStatus.EXECUTED}`, () => {
          expect(isRentalListingExecuted(rental)).toBe(
            rentalStatus === RentalStatus.EXECUTED
          )
        })
      })
    })
  })
})

describe('when checking if a rental has ended', () => {
  let rental: RentalListing
  beforeEach(() => {
    rental = {
      status: RentalStatus.EXECUTED
    } as RentalListing
  })

  describe('and the rental did not start yet', () => {
    beforeEach(() => {
      rental.status = RentalStatus.OPEN
      rental.startedAt = null
      rental.rentedDays = null
    })

    it('should return false', () => {
      expect(hasRentalEnded(rental)).toBe(false)
    })
  })

  describe('and the rental has started and ended', () => {
    beforeEach(() => {
      rental.startedAt = Date.now() - aDay * 5
      rental.rentedDays = 2
    })

    it('should return false', () => {
      expect(hasRentalEnded(rental)).toBe(true)
    })
  })

  describe('and the rental has started but not ended yet', () => {
    beforeEach(() => {
      rental.startedAt = Date.now() + aDay * 5
      rental.rentedDays = 2
    })

    it('should return true', () => {
      expect(hasRentalEnded(rental)).toBe(false)
    })
  })
})

describe("when getting a rental's end date", () => {
  let rental: RentalListing
  beforeEach(() => {
    rental = {
      status: RentalStatus.EXECUTED
    } as RentalListing
  })

  describe('and the rental has not started yet', () => {
    beforeEach(() => {
      rental.status = RentalStatus.OPEN
      rental.startedAt = null
      rental.rentedDays = null
    })

    it('should return null', () => {
      expect(getRentalEndDate(rental)).toBeNull()
    })
  })

  describe('and the rental has started', () => {
    beforeEach(() => {
      rental.status = RentalStatus.OPEN
      rental.startedAt = Date.now() + aDay * 5
      rental.rentedDays = 2
    })

    it('should return the started date plus the rented days', () => {
      expect(getRentalEndDate(rental)).toEqual(
        new Date(rental.startedAt! + 2 * aDay)
      )
    })
  })
})

describe('when getting the rental chosen period', () => {
  let rental: RentalListing
  beforeEach(() => {
    rental = {
      status: RentalStatus.EXECUTED
    } as RentalListing
  })

  describe("and the rental hasn't started yet", () => {
    beforeEach(() => {
      rental = {
        status: RentalStatus.OPEN,
        periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }],
        startedAt: null,
        rentedDays: null
      } as RentalListing
    })

    it('should throw signaling that the rental period was not found', () => {
      expect(() => getRentalChosenPeriod(rental)).toThrowError(
        'Rental period was not found'
      )
    })
  })

  describe('and the rental has started', () => {
    beforeEach(() => {
      rental = {
        status: RentalStatus.EXECUTED,
        startedAt: Date.now(),
        rentedDays: 2,
        periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }]
      } as RentalListing
    })

    it('should return the rental period that matches the rented days', () => {
      expect(getRentalChosenPeriod(rental)).toEqual(rental.periods[0])
    })
  })
})

describe('when checking if a rental listing is open', () => {
  describe('and the rental is null', () => {
    it('should return false', () => {
      expect(isRentalListingOpen(null)).toBe(false)
    })
  })

  describe('and the rental listing is not null', () => {
    let rental: RentalListing
    beforeEach(() => {
      rental = {
        status: RentalStatus.OPEN
      } as RentalListing
    })

    Object.values(RentalStatus).forEach(rentalStatus => {
      describe(`and its status is "${rentalStatus}"`, () => {
        beforeEach(() => {
          rental.status = rentalStatus
        })

        it(`should return ${rentalStatus === RentalStatus.OPEN}`, () => {
          expect(isRentalListingOpen(rental)).toBe(
            rentalStatus === RentalStatus.OPEN
          )
        })
      })
    })
  })
})

describe('when checking if a rental listing is cancelled', () => {
  describe('and the rental is null', () => {
    it('should return false', () => {
      expect(isRentalListingCancelled(null)).toBe(false)
    })
  })

  describe('and the rental listing is not null', () => {
    let rental: RentalListing
    beforeEach(() => {
      rental = {
        status: RentalStatus.CANCELLED
      } as RentalListing
    })

    Object.values(RentalStatus).forEach(rentalStatus => {
      describe(`and its status is "${rentalStatus}"`, () => {
        beforeEach(() => {
          rental.status = rentalStatus
        })

        it(`should return ${rentalStatus === RentalStatus.OPEN}`, () => {
          expect(isRentalListingCancelled(rental)).toBe(
            rentalStatus === RentalStatus.CANCELLED
          )
        })
      })
    })
  })
})

describe('when getting if a rental can be claimed', () => {
  let rental: RentalListing
  let asset: Asset
  let userAddress: string
  let lessor: string
  let nftChainId: number
  let rentalsContract: ContractData

  describe('and the rental is in status EXECUTED', () => {
    beforeEach(() => {
      nftChainId = 1
      rentalsContract = getContract(ContractName.Rentals, nftChainId)
      userAddress = '0xanAddress'
      asset = {
        owner: rentalsContract.address,
        chainId: nftChainId
      } as Asset
      rental = {
        status: RentalStatus.EXECUTED,
        periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }],
        startedAt: Date.now() - aDay * 5,
        rentedDays: 1,
        lessor
      } as RentalListing
    })

    it('should return true if the end date is in the past', () => {
      expect(canBeClaimed(userAddress, rental, asset)).toBeTruthy()
    })
  })

  describe('and the rental is in status OPEN', () => {
    beforeEach(() => {
      rental = {
        status: RentalStatus.OPEN,
        lessor: userAddress,
        periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }]
      } as RentalListing
    })

    describe('and the asset owner is not the userAddress because it is still in the rentals contract', () => {
      beforeEach(() => {
        nftChainId = 1
        rentalsContract = getContract(ContractName.Rentals, nftChainId)
        asset = {
          owner: rentalsContract.address,
          chainId: nftChainId
        } as Asset
      })
      it('should return true since the owner does not hold the asset', () => {
        expect(canBeClaimed(userAddress, rental, asset)).toBeTruthy()
      })
    })

    describe('and the asset owner is the userAddress', () => {
      beforeEach(() => {
        asset = {
          owner: userAddress
        } as Asset
        rental = {
          status: RentalStatus.OPEN,
          lessor: userAddress,
          periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }]
        } as RentalListing
      })
      it('should return false since the owner holds the asset', () => {
        expect(canBeClaimed(userAddress, rental, asset)).toBeFalsy()
      })
    })
  })

  describe('and the rental is in status CANCELLED', () => {
    beforeEach(() => {
      userAddress = '0xanAddress'
      rental = {
        status: RentalStatus.CANCELLED,
        lessor: userAddress,
        periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }]
      } as RentalListing
    })

    describe('and the asset owner is not the userAddress because it is still in the rentals contract', () => {
      beforeEach(() => {
        nftChainId = 1
        rentalsContract = getContract(ContractName.Rentals, nftChainId)
        asset = {
          owner: rentalsContract.address,
          chainId: nftChainId
        } as Asset
      })
      it('should return true since the owner does not hold the asset', () => {
        expect(canBeClaimed(userAddress, rental, asset)).toBeTruthy()
      })
    })

    describe('and the asset owner is the userAddress', () => {
      beforeEach(() => {
        asset = {
          owner: userAddress
        } as Asset
      })
      it('should return false since the owner holds the asset', () => {
        expect(canBeClaimed(userAddress, rental, asset)).toBeFalsy()
      })
    })
  })
})

describe('when getting if a rental is locked', () => {
  let rental: RentalListing
  let asset: Asset
  let userAddress: string
  let lessor: string
  let nftChainId: number
  let rentalsContract: ContractData

  describe('and the rental is in status EXECUTED', () => {
    beforeEach(() => {
      nftChainId = 1
      rentalsContract = getContract(ContractName.Rentals, nftChainId)
      userAddress = '0xanAddress'
      asset = {
        owner: rentalsContract.address,
        chainId: nftChainId
      } as Asset
      rental = {
        status: RentalStatus.EXECUTED,
        periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }],
        startedAt: Date.now() - aDay * 5,
        rentedDays: 1,
        lessor
      } as RentalListing
    })

    it('should return true', () => {
      expect(canBeClaimed(userAddress, rental, asset)).toBe(true)
    })
  })

  describe('and the rental is in status OPEN', () => {
    beforeEach(() => {
      userAddress = '0xanAddress'
      rental = {
        status: RentalStatus.OPEN,
        lessor: userAddress,
        periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }]
      } as RentalListing
    })

    describe('and the asset owner is not the userAddress', () => {
      beforeEach(() => {
        nftChainId = 1
        rentalsContract = getContract(ContractName.Rentals, nftChainId)
        asset = {
          owner: rentalsContract.address,
          chainId: nftChainId
        } as Asset
      })
      it('should return true since the owner does not hold the asset', () => {
        expect(canBeClaimed(userAddress, rental, asset)).toBeTruthy()
      })
    })

    describe('and the asset owner is the userAddress', () => {
      beforeEach(() => {
        asset = {
          owner: userAddress
        } as Asset
        rental = {
          status: RentalStatus.OPEN,
          lessor: userAddress,
          periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }]
        } as RentalListing
      })
      it('should return false since the owner holds the asset', () => {
        expect(canBeClaimed(userAddress, rental, asset)).toBeFalsy()
      })
    })
  })

  describe('and the rental is in status CANCELLED', () => {
    beforeEach(() => {
      userAddress = '0xanAddress'
      rental = {
        status: RentalStatus.CANCELLED,
        lessor: userAddress,
        periods: [{ minDays: 2, maxDays: 2, pricePerDay: '100000' }]
      } as RentalListing
    })

    describe('and the asset owner is not the userAddress', () => {
      beforeEach(() => {
        nftChainId = 1
        rentalsContract = getContract(ContractName.Rentals, nftChainId)
        asset = {
          owner: rentalsContract.address,
          chainId: nftChainId
        } as Asset
      })
      it('should return true since the owner does not hold the asset', () => {
        expect(canBeClaimed(userAddress, rental, asset)).toBeTruthy()
      })
    })

    describe('and the asset owner is the userAddress', () => {
      beforeEach(() => {
        asset = {
          owner: userAddress
        } as Asset
      })
      it('should return false since the owner holds the asset', () => {
        expect(canBeClaimed(userAddress, rental, asset)).toBeFalsy()
      })
    })
  })
})

describe('when checking if a new rental can be created', () => {
  describe('and the rental is null', () => {
    it('should return true', () => {
      expect(canCreateANewRental(null)).toBe(true)
    })
  })

  describe('and the rental is cancelled', () => {
    let rental: RentalListing
    beforeEach(() => {
      rental = {
        status: RentalStatus.CANCELLED
      } as RentalListing
    })

    it('should return true', () => {
      expect(canCreateANewRental(rental)).toBe(true)
    })
  })

  describe('and the rental is executed but not finished', () => {
    let rental: RentalListing
    beforeEach(() => {
      rental = {
        status: RentalStatus.EXECUTED,
        startedAt: Date.now(),
        rentedDays: 10
      } as RentalListing
    })

    it('should return false', () => {
      expect(canCreateANewRental(rental)).toBe(false)
    })
  })

  describe('and the rental is executed and has finished', () => {
    let rental: RentalListing
    beforeEach(() => {
      rental = {
        status: RentalStatus.EXECUTED,
        startedAt: Date.now() - 3 * aDay,
        rentedDays: 1
      } as RentalListing
    })

    it('should return true', () => {
      expect(canCreateANewRental(rental)).toBe(true)
    })
  })
})

describe('when waiting until the rental changes the status', () => {
  let nft: NFT
  let desiredStatus: RentalStatus
  let listing: RentalListing
  beforeEach(() => {
    listing = {
      status: RentalStatus.OPEN
    } as RentalListing
    nft = {
      openRentalId: 'rentalId'
    } as NFT
    desiredStatus = RentalStatus.CANCELLED
    ;(rentalsAPI.refreshRentalListing as jest.Mock).mockResolvedValueOnce(
      listing
    )
    runTimerAutomaticallyOnce()
    ;(rentalsAPI.refreshRentalListing as jest.Mock).mockResolvedValueOnce({
      ...listing,
      status: desiredStatus
    })
    runTimerAutomaticallyOnce()
  })
  it('should call the rentalsAPI refreshRentalListing endpoint until it returns the rental in the status desired', async () => {
    expect(
      await waitUntilRentalChangesStatus(nft, desiredStatus)
    ).toStrictEqual({
      ...listing,
      status: desiredStatus
    })
  })
})

describe('when generating an ECDSA signature with a valid V from a signature', () => {
  describe('and the original signature has a valid V', () => {
    it('should return the same signature', () => {
      expect(
        generateECDSASignatureWithValidV(
          '0x402a10749ebca5d35af41b5780a2667e7edbc2ec64bad157714f533c69cb694c4e4595b88dce064a92772850e903c23d0f67625aeccf9308841ad34929daf51c'
        )
      ).toBe(
        '0x402a10749ebca5d35af41b5780a2667e7edbc2ec64bad157714f533c69cb694c4e4595b88dce064a92772850e903c23d0f67625aeccf9308841ad34929daf51c'
      )
    })
  })

  describe('and the original signature is invalid and ending in 0', () => {
    it('should return the original signature with its latest byte with the value 27', () => {
      expect(
        generateECDSASignatureWithValidV(
          '0x402a10749ebca5d35af41b5780a2667e7edbc2ec64bad157714f533c69cb694c4e4595b88dce064a92772850e903c23d0f67625aeccf9308841ad34929daf500'
        )
      ).toBe(
        '0x402a10749ebca5d35af41b5780a2667e7edbc2ec64bad157714f533c69cb694c4e4595b88dce064a92772850e903c23d0f67625aeccf9308841ad34929daf51b'
      )
    })
  })

  describe('and the original signature is invalid and ending in 1', () => {
    it('should return the original signature with its latest byte with the value 28', () => {
      expect(
        generateECDSASignatureWithValidV(
          '0x402a10749ebca5d35af41b5780a2667e7edbc2ec64bad157714f533c69cb694c4e4595b88dce064a92772850e903c23d0f67625aeccf9308841ad34929daf501'
        )
      ).toBe(
        '0x402a10749ebca5d35af41b5780a2667e7edbc2ec64bad157714f533c69cb694c4e4595b88dce064a92772850e903c23d0f67625aeccf9308841ad34929daf51c'
      )
    })
  })
})
