import { Item } from '@dcl/schemas'
import { NFT } from '../nft/types'
import { locations } from '../routing/locations'
import { Asset } from './types'
import { getAssetUrl } from './utils'

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
