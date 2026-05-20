import { NFTCategory } from '@dcl/schemas'
import { NFT } from '../modules/nft/types'
import { ESTATE_LR_XOR_SAFE_MAX_SIZE, isEstateListingAffectedByUpgrade } from './estateUpgrade'

function makeEstateNFT(size: number | undefined): NFT {
  return {
    category: NFTCategory.ESTATE,
    data: { estate: size !== undefined ? { size, parcels: [], description: '' } : undefined }
  } as unknown as NFT
}

function makeParcelNFT(): NFT {
  return {
    category: NFTCategory.PARCEL,
    data: { parcel: { x: '1', y: '1', description: null } }
  } as unknown as NFT
}

describe('isEstateListingAffectedByUpgrade', () => {
  describe('when the NFT is not an Estate', () => {
    it('should return false', () => {
      expect(isEstateListingAffectedByUpgrade(makeParcelNFT())).toBe(false)
    })
  })

  describe('when the NFT is an Estate', () => {
    describe('and the Estate size exceeds the safe threshold', () => {
      it('should return true', () => {
        expect(isEstateListingAffectedByUpgrade(makeEstateNFT(ESTATE_LR_XOR_SAFE_MAX_SIZE + 1))).toBe(true)
      })
    })

    describe('and the Estate size is at the safe threshold', () => {
      it('should return false', () => {
        expect(isEstateListingAffectedByUpgrade(makeEstateNFT(ESTATE_LR_XOR_SAFE_MAX_SIZE))).toBe(false)
      })
    })

    describe('and the Estate size is below the safe threshold', () => {
      it('should return false', () => {
        expect(isEstateListingAffectedByUpgrade(makeEstateNFT(5))).toBe(false)
      })
    })

    describe('and the Estate has no size data', () => {
      it('should return false', () => {
        expect(isEstateListingAffectedByUpgrade(makeEstateNFT(undefined))).toBe(false)
      })
    })
  })
})
