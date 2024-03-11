import { BodyShape, NFTCategory } from '@dcl/schemas'
import { NFTData } from '../vendor/decentraland'
import { NFT } from './types'
import { isPartOfEstate, getBodyShapeUrn, isGender } from './utils'

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

describe('when getting the Wearable BodyShapeUrn', () => {
  let nft: NFT
  beforeEach(() => {
    nft = {
      data: {
        wearable: {} as NFTData[NFTCategory.WEARABLE]
      }
    } as NFT
  })

  describe('and the NFT bodyShape is "BaseMale"', () => {
    beforeEach(() => {
      nft.data.wearable = {
        bodyShapes: ['BaseMale' as BodyShape.MALE]
      } as NFTData[NFTCategory.WEARABLE]
    })

    it('should return "urn:decentraland:off-chain:base-avatars:BaseMale"', () => {
      const bodyShape: string = nft.data.wearable ? nft.data.wearable.bodyShapes[0] : ''
      expect(getBodyShapeUrn(bodyShape)).toBe(BodyShape.MALE)
    })
  })

  describe('and the NFT bodyShape is "BaseFemale"', () => {
    beforeEach(() => {
      nft.data.wearable = {
        bodyShapes: ['BaseFemale' as BodyShape.FEMALE]
      } as NFTData[NFTCategory.WEARABLE]
    })

    it('should return "urn:decentraland:off-chain:base-avatars:BaseFemale"', () => {
      const bodyShape: string = nft.data.wearable ? nft.data.wearable.bodyShapes[0] : ''
      expect(getBodyShapeUrn(bodyShape)).toBe(BodyShape.FEMALE)
    })
  })
})

describe('when checking that a Wearable is gender or unisex', () => {
  let nft: NFT
  beforeEach(() => {
    nft = {
      data: {
        wearable: {} as NFTData[NFTCategory.WEARABLE]
      }
    } as NFT
  })

  describe('and the Wearable bodyShape is "BaseMale"', () => {
    beforeEach(() => {
      nft.data.wearable = {
        bodyShapes: ['BaseMale' as BodyShape.MALE]
      } as NFTData[NFTCategory.WEARABLE]
    })

    describe('and is comparing to "BodyShape.MALE"', () => {
      it('should return true', () => {
        const bodyShape: BodyShape[] = nft.data.wearable ? [nft.data.wearable.bodyShapes[0]] : []
        expect(isGender(bodyShape, BodyShape.MALE)).toBe(true)
      })
    })

    describe('and is comparing to "BodyShape.FEMALE"', () => {
      it('should return false', () => {
        const bodyShape: BodyShape[] = nft.data.wearable ? [nft.data.wearable.bodyShapes[0]] : []
        expect(isGender(bodyShape, BodyShape.FEMALE)).toBe(false)
      })
    })
  })

  describe('and the Wearable bodyShape is "BaseFemale"', () => {
    beforeEach(() => {
      nft.data.wearable = {
        bodyShapes: ['BaseFemale' as BodyShape.FEMALE]
      } as NFTData[NFTCategory.WEARABLE]
    })

    describe('and is comparing to "BodyShape.FEMALE"', () => {
      it('should return true', () => {
        const bodyShape: BodyShape[] = nft.data.wearable ? [nft.data.wearable.bodyShapes[0]] : []
        expect(isGender(bodyShape, BodyShape.FEMALE)).toBe(true)
      })
    })

    describe('and is comparing to "BodyShape.MALE"', () => {
      it('should return false', () => {
        const bodyShape: BodyShape[] = nft.data.wearable ? [nft.data.wearable.bodyShapes[0]] : []
        expect(isGender(bodyShape, BodyShape.MALE)).toBe(false)
      })
    })
  })

  describe('and the Wearable bodyShape is "Unisex"', () => {
    beforeEach(() => {
      nft.data.wearable = {
        bodyShapes: ['BaseMale' as BodyShape.MALE, 'BaseFemale' as BodyShape.FEMALE]
      } as NFTData[NFTCategory.WEARABLE]
    })

    describe('and is comparing to "BodyShape.FEMALE"', () => {
      it('should return false', () => {
        const bodyShape: BodyShape[] = nft.data.wearable ? nft.data.wearable.bodyShapes : []
        expect(isGender(bodyShape, BodyShape.FEMALE)).toBe(false)
      })
    })

    describe('and is comparing to "BodyShape.MALE"', () => {
      it('should return false', () => {
        const bodyShape: BodyShape[] = nft.data.wearable ? nft.data.wearable.bodyShapes : []
        expect(isGender(bodyShape, BodyShape.MALE)).toBe(false)
      })
    })
  })
})
