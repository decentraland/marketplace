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

  // `history` recognises the basename case-insensitively before React Router resolves the
  // path, so a case variant reaches the very same route. Recognising it differently here
  // would leave that route served by this app instead of redirecting it.
  it.each([
    '/MARKETPLACE/contracts/0xAbC0000000000000000000000000000000000001/items/3',
    '/MarketPlace/contracts/0xAbC0000000000000000000000000000000000001/items/3',
    '/marketplace/contracts/0xAbC0000000000000000000000000000000000001/items/3'
  ])('should map %s the same way the router resolves it', pathname => {
    expect(getShopPath(pathname, params(''))).toBe('/item/0xabc0000000000000000000000000000000000001/3')
  })

  it.each(['/MARKETPLACE/browse', '/MarketPlace/names/claim'])('should map the case variant %s', pathname => {
    expect(getShopPath(pathname, params(''))).not.toBeNull()
  })

  // The basename has to end at a path boundary, which is also what `history` requires: a
  // path that merely starts with those characters is a different route and keeps its prefix.
  it('should not treat a longer first segment as the basename', () => {
    expect(getShopPath('/marketplacefoo/contracts/0xAbC0000000000000000000000000000000000001/items/3', params(''))).toBeNull()
  })

  // The router resolves a trailing slash to the same route, so the hand-off has to match.
  it.each(['/marketplace/names/claim/', '/MARKETPLACE/names/claim/', '/marketplace/browse/'])(
    'should map %s the same way as its slashless form',
    pathname => {
      expect(getShopPath(pathname, params(''))).not.toBeNull()
    }
  )

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
