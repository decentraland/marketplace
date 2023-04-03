import { NFTSortBy } from '../../../nft/types'
import { nftAPI } from './api'

describe('when sortBy property is defined', () => {
  describe('and sortBy property is MAX_RENTAL_PRICE', () => {
    it('should sortBy query param with the correct value', () => {
      jest.spyOn(nftAPI, 'request').mockResolvedValue([])
      nftAPI.fetch({ orderBy: NFTSortBy.MAX_RENTAL_PRICE, first: 1, skip: 0 })
      expect(nftAPI.request).toHaveBeenCalledWith("get", expect.stringContaining('sortBy=max_rental_price'))
    })

    it('should send isOnRent query param as true', () => {
      jest.spyOn(nftAPI, 'request').mockResolvedValue([])
      nftAPI.fetch({ orderBy: NFTSortBy.MAX_RENTAL_PRICE, first: 1, skip: 0 })
      expect(nftAPI.request).toHaveBeenCalledWith("get", expect.stringContaining('isOnRent=true'))
    })
  })

  describe('and sortBy property is ORDER_CREATED_AT', () => {
    it('should sortBy query param with the correct value', () => {
      jest.spyOn(nftAPI, 'request').mockResolvedValue([])
      nftAPI.fetch({ orderBy: NFTSortBy.ORDER_CREATED_AT, first: 1, skip: 0 })
      expect(nftAPI.request).toHaveBeenCalledWith("get", expect.stringContaining('sortBy=recently_listed'))
    })

    it('should send isOnRent query param as true', () => {
      jest.spyOn(nftAPI, 'request').mockResolvedValue([])
      nftAPI.fetch({ orderBy: NFTSortBy.ORDER_CREATED_AT, first: 1, skip: 0 })
      expect(nftAPI.request).toHaveBeenCalledWith("get", expect.not.stringContaining('isOnRent=true'))
    })
  })
})
