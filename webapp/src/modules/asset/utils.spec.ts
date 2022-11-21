import { Item, RentalListing, RentalStatus } from '@dcl/schemas'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../nft/types'
import { locations } from '../routing/locations'
import { Asset } from './types'
import { getAssetUrl, isOwnedBy } from './utils'

let asset: Asset
let wallet: Wallet
let rental: RentalListing

describe("when getting the asset's url", () => {
  let asset: Asset
  beforeEach(() => {
    asset = {
      contractAddress: 'aContractAddress'
    } as Asset
  })

  describe('and the token id property is defined in the asset', () => {
    beforeEach(() => {
      ;(asset as NFT).tokenId = 'aTokenId'
    })

    describe('and the user is a manager of the asset', () => {
      it('should return the location path of the management page', () => {
        expect(getAssetUrl(asset, true)).toEqual(
          locations.manage(asset.contractAddress, (asset as NFT).tokenId)
        )
      })
    })

    describe('and the user is not a manager of the asset', () => {
      it("should return the location path of the token's page", () => {
        expect(getAssetUrl(asset, false)).toEqual(
          locations.nft(asset.contractAddress, (asset as NFT).tokenId)
        )
      })
    })
  })

  describe('and the item id property is defined in the asset', () => {
    beforeEach(() => {
      ;(asset as Item).itemId = 'aTokenId'
    })

    describe('and the user is a manager of the asset', () => {
      it("should return the location path of the item's page", () => {
        expect(getAssetUrl(asset, true)).toEqual(
          locations.item(asset.contractAddress, (asset as Item).itemId)
        )
      })
    })

    describe('and the user is not a manager of the asset', () => {
      it("should return the location path of the item's page", () => {
        expect(getAssetUrl(asset, false)).toEqual(
          locations.item(asset.contractAddress, (asset as Item).itemId)
        )
      })
    })
  })
})

describe('when getting the asset owner', () => {
  describe('and the asset has no rental', () => {
    beforeEach(() => {
      asset = {
        openRentalId: null,
        owner: 'anOwner'
      } as Asset
    })
    describe('and the logged user is the asset owner', () => {
      beforeEach(() => {
        wallet = {
          address: (asset as NFT).owner
        } as Wallet
      })
      it('should return true', () => {
        expect(isOwnedBy(asset, wallet)).toBe(true)
      })
    })
    describe('and the logged user is not the asset owner', () => {
      beforeEach(() => {
        wallet = {
          address: 'notTheAssetOwner'
        } as Wallet
      })
      it('should return false', () => {
        expect(isOwnedBy(asset, wallet)).toBe(false)
      })
    })
  })

  describe('and the asset has a rental', () => {
    beforeEach(() => {
      asset = {
        openRentalId: null,
        owner: 'anOwner',
        chainId: 1
      } as Asset
    })
    describe('and the rental is in status OPEN', () => {
      beforeEach(() => {
        rental = {
          status: RentalStatus.OPEN
        } as RentalListing
      })

      describe('and the logged user is the asset owner', () => {
        beforeEach(() => {
          wallet = {
            address: (asset as NFT).owner
          } as Wallet
        })
        it('should return true', () => {
          expect(isOwnedBy(asset, wallet, rental)).toBe(true)
        })
      })

      describe('and the logged user is not the asset owner', () => {
        beforeEach(() => {
          wallet = {
            address: 'notTheAssetOwner'
          } as Wallet
        })
        it('should return false', () => {
          expect(isOwnedBy(asset, wallet, rental)).toBe(false)
        })
      })
    })

    describe('and the rental is in status EXECUTED', () => {
      beforeEach(() => {
        rental = {
          status: RentalStatus.EXECUTED
        } as RentalListing
      })
      describe('and the logged user is the rental lessor the asset is in the rentals contract', () => {
        const rentalsContract: ContractData = getContract(
          ContractName.Rentals,
          1
        )
        beforeEach(() => {
          asset = {
            openRentalId: null,
            owner: rentalsContract.address,
            chainId: 1
          } as Asset
          wallet = {
            address: 'anAddress'
          } as Wallet
          rental.lessor = wallet.address
        })
        it('should return true', () => {
          expect(isOwnedBy(asset, wallet, rental)).toBe(true)
        })
      })

      describe('and the logged user is not the rental lessor', () => {
        beforeEach(() => {
          asset = {
            openRentalId: null,
            owner: 'anOwner',
            chainId: 1
          } as Asset
          wallet = {
            address: 'notTheRentalLessor'
          } as Wallet
        })
        it('should return false', () => {
          expect(isOwnedBy(asset, wallet, rental)).toBe(false)
        })
      })
    })

    describe('and the rental is in status CANCELLED', () => {
      beforeEach(() => {
        rental = {
          status: RentalStatus.CANCELLED
        } as RentalListing
      })
      describe('and the logged user is the asset owner and rental lessor', () => {
        beforeEach(() => {
          asset = {
            openRentalId: null,
            owner: 'anOwner'
          } as Asset
          wallet = {
            address: (asset as NFT).owner
          } as Wallet
          rental.lessor = wallet.address
        })
        it('should return true', () => {
          expect(isOwnedBy(asset, wallet, rental)).toBe(true)
        })
      })

      describe('and the logged user is the asset owner and it has and old rental lessor', () => {
        beforeEach(() => {
          asset = {
            openRentalId: null,
            owner: 'anOwner'
          } as Asset
          wallet = {
            address: (asset as NFT).owner
          } as Wallet
          rental.lessor = 'exOwner'
        })
        it('should return true', () => {
          expect(isOwnedBy(asset, wallet, rental)).toBe(true)
        })
      })

      describe('and the logged user is the old asset owner and it has the old rental data', () => {
        beforeEach(() => {
          asset = {
            openRentalId: null,
            owner: 'anOwner',
            chainId: 1
          } as Asset
          wallet = {
            address: 'exOwner'
          } as Wallet
          rental.lessor = 'exOwner'
        })
        it('should return false', () => {
          expect(isOwnedBy(asset, wallet, rental)).toBe(false)
        })
      })

      describe('and the logged user is not the asset owner since it is still in the rentals contract because it hasnt been claimed yet', () => {
        const rentalsContract: ContractData = getContract(
          ContractName.Rentals,
          1
        )
        beforeEach(() => {
          asset = {
            openRentalId: null,
            owner: rentalsContract.address,
            chainId: 1
          } as Asset
          wallet = {
            address: (asset as NFT).owner
          } as Wallet
          rental.lessor = wallet.address
        })
        it('should return true', () => {
          expect(isOwnedBy(asset, wallet, rental)).toBe(true)
        })
      })
    })
  })
})
