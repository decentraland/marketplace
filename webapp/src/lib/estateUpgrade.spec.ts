import { NFTCategory } from '@dcl/schemas'
import { NFT } from '../modules/nft/types'
import { ESTATE_LR_XOR_SAFE_MAX_SIZE, ESTATE_V2_FINGERPRINT_LISTING_CUTOFF, isEstateListingAffectedByUpgrade } from './estateUpgrade'

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

const beforeCutoffInSeconds = ESTATE_V2_FINGERPRINT_LISTING_CUTOFF - 1
const afterCutoffInSeconds = ESTATE_V2_FINGERPRINT_LISTING_CUTOFF + 1
const aboveThreshold = ESTATE_LR_XOR_SAFE_MAX_SIZE + 1

describe('isEstateListingAffectedByUpgrade', () => {
  describe('when the NFT is not an Estate', () => {
    it('should return false even with a pre-cutoff listing', () => {
      expect(isEstateListingAffectedByUpgrade(makeParcelNFT(), beforeCutoffInSeconds)).toBe(false)
    })
  })

  describe('when the NFT is an Estate larger than the safe threshold', () => {
    describe('and there is no listing', () => {
      it('should return false', () => {
        expect(isEstateListingAffectedByUpgrade(makeEstateNFT(aboveThreshold))).toBe(false)
      })
    })

    describe('and the listing was created before the v2-fingerprint cutoff', () => {
      it('should return true', () => {
        expect(isEstateListingAffectedByUpgrade(makeEstateNFT(aboveThreshold), beforeCutoffInSeconds)).toBe(true)
      })
    })

    describe('and the listing was created after the v2-fingerprint cutoff', () => {
      it('should return false', () => {
        expect(isEstateListingAffectedByUpgrade(makeEstateNFT(aboveThreshold), afterCutoffInSeconds)).toBe(false)
      })
    })

    describe('and the listing timestamp is in milliseconds', () => {
      describe('and it is before the cutoff', () => {
        it('should return true', () => {
          expect(isEstateListingAffectedByUpgrade(makeEstateNFT(aboveThreshold), beforeCutoffInSeconds * 1000)).toBe(true)
        })
      })

      describe('and it is after the cutoff', () => {
        it('should return false', () => {
          expect(isEstateListingAffectedByUpgrade(makeEstateNFT(aboveThreshold), afterCutoffInSeconds * 1000)).toBe(false)
        })
      })
    })
  })

  describe('when the NFT is an Estate at or below the safe threshold', () => {
    describe('and the size is at the threshold', () => {
      it('should return false even with a pre-cutoff listing', () => {
        expect(isEstateListingAffectedByUpgrade(makeEstateNFT(ESTATE_LR_XOR_SAFE_MAX_SIZE), beforeCutoffInSeconds)).toBe(false)
      })
    })

    describe('and the size is below the threshold', () => {
      it('should return false even with a pre-cutoff listing', () => {
        expect(isEstateListingAffectedByUpgrade(makeEstateNFT(5), beforeCutoffInSeconds)).toBe(false)
      })
    })
  })

  describe('when the Estate has no size data', () => {
    it('should return false', () => {
      expect(isEstateListingAffectedByUpgrade(makeEstateNFT(undefined), beforeCutoffInSeconds)).toBe(false)
    })
  })
})
