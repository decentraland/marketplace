import { config } from '../../config'
import { getShopPath, getShopUrl } from './shopRedirect'

jest.mock('../routing/basename', () => ({
  getBasename: () => '/marketplace'
}))

const params = (search: string) => new URLSearchParams(search)

describe('when mapping a marketplace destination to the shop', () => {
  it('should map an item detail page, lowercasing the contract', () => {
    expect(getShopPath('/marketplace/contracts/0xAbC0000000000000000000000000000000000001/items/3', params(''))).toBe(
      '/item/0xabc0000000000000000000000000000000000001/3'
    )
  })

  it('should map the browse sections a mobile client links to', () => {
    expect(getShopPath('/marketplace/browse', params('section=wearables'))).toBe('/items?category=wearable')
    expect(getShopPath('/marketplace/browse', params('section=emotes'))).toBe('/items?category=emote')
  })

  it('should fall back to the unfiltered grid for a section the shop has no category for', () => {
    expect(getShopPath('/marketplace/browse', params('section=land'))).toBe('/items')
    expect(getShopPath('/marketplace', params(''))).toBe('/items')
  })

  it('should map the NAME claim page to the shop names category', () => {
    expect(getShopPath('/marketplace/names/claim', params(''))).toBe('/items?category=names')
  })

  it('should leave the purchase flow and everything else on this app', () => {
    expect(getShopPath('/marketplace/buy', params(''))).toBeNull()
    expect(getShopPath('/marketplace/success', params(''))).toBeNull()
    expect(getShopPath('/marketplace/account/0xabc', params(''))).toBeNull()
  })
})

describe('when building the absolute shop url', () => {
  it('should carry the mobile-iap marker the shop reads', () => {
    expect(getShopUrl('/marketplace/browse', params('section=wearables&view=mobile-iap'))).toBe(
      `${config.get('SHOP_URL')}/items?category=wearable&view=mobile-iap`
    )
  })

  it('should return null when the shop does not serve the destination', () => {
    expect(getShopUrl('/marketplace/success', params(''))).toBeNull()
  })
})
