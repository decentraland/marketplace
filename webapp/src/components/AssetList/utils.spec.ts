import { locations } from '../../modules/routing/locations'
import * as utils from './utils'

describe('#getLastVisitedElementId', () => {
  describe('when current location is marketplace browse section', () => {
    describe('and previous location is nft detail page', () => {
      it('should return nft element id', () => {
        expect(
          utils.getLastVisitedElementId(
            locations.browse(),
            locations.nft('contract', 'tokenId')
          )
        ).toEqual('contract-tokenId')
      })
    })

    describe('and previous location is item detail page', () => {
      it('should return nft element id', () => {
        expect(
          utils.getLastVisitedElementId(
            locations.browse(),
            locations.item('contract', 'itemId')
          )
        ).toEqual('contract-itemId')
      })
    })

    describe('and previous location is any other page', () => {
      it('should return null', () => {
        expect(
          utils.getLastVisitedElementId(locations.browse(), locations.account())
        ).toEqual(null)
      })
    })
  })

  describe('when current location is lands section', () => {
    describe('and previous location is nft detail page', () => {
      it('should return nft element id', () => {
        expect(
          utils.getLastVisitedElementId(
            locations.lands(),
            locations.nft('contract', 'tokenId')
          )
        ).toEqual('contract-tokenId')
      })
    })

    describe('and previous location is any other page', () => {
      it('should return null', () => {
        expect(
          utils.getLastVisitedElementId(locations.browse(), locations.account())
        ).toEqual(null)
      })
    })
  })
})
