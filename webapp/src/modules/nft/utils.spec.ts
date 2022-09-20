import { NFTCategory } from '@dcl/schemas'
import { NFT } from './types'
import { isPartOfEstate } from './utils'

describe('when checking that a NFT is part of a Estate', () => {
  let nft: NFT
  beforeEach(() => {
    nft = {
      data: {}
    } as NFT
  })

  describe('and the NFT is a Estate', () => {
    beforeEach(() => {
      nft = {
        category: NFTCategory.ESTATE
      } as NFT
    })

    it('should return false', () => {
      expect(isPartOfEstate(nft)).toBe(false)
    })
  })

  describe('and the NFT is a Parcel', () => {
    beforeEach(() => {
      nft.category = NFTCategory.PARCEL
    })

    describe('and the NFT belongs to an Estate', () => {
      beforeEach(() => {
        nft.data = {
          ...nft.data,
          parcel: {
            x: '100',
            y: '100',
            description: null,
            estate: {
              tokenId: 'aTokenId',
              name: 'aEstateId'
            }
          }
        }
      })

      it('should return true', () => {
        expect(isPartOfEstate(nft)).toBe(true)
      })
    })

    describe('and the NFT does not belong to an Estate', () => {
      beforeEach(() => {
        nft.data = {
          ...nft.data,
          parcel: {
            x: '100',
            y: '100',
            description: null,
            estate: null
          }
        }
      })

      it('should return false', () => {
        expect(isPartOfEstate(nft)).toBe(false)
      })
    })
  })

  describe('and the NFT is a Wearable', () => {
    beforeEach(() => {
      nft.category = NFTCategory.WEARABLE
    })

    it('should return false', () => {
      expect(isPartOfEstate(nft)).toBe(false)
    })
  })

  describe('and the NFT is an ENS', () => {
    beforeEach(() => {
      nft.category = NFTCategory.ENS
    })

    it('should return false', () => {
      expect(isPartOfEstate(nft)).toBe(false)
    })
  })

  describe('and the NFT is an Emote', () => {
    beforeEach(() => {
      nft.category = NFTCategory.EMOTE
    })

    it('should return false', () => {
      expect(isPartOfEstate(nft)).toBe(false)
    })
  })
})
