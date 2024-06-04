import { BodyShape, EmoteCategory, NFTCategory, Network, Rarity, WearableCategory } from '@dcl/schemas'
import { RootState } from '../../../reducer'
import { VendorName } from '../../../vendor'
import { UIState } from '../../reducer'
import { View } from '../../types'
import { getHomepage } from './selectors'

describe('getHomepage', () => {
  let itemId: string
  let state: RootState
  beforeEach(() => {
    itemId = '0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc-1'
    state = {
      ui: {
        asset: {
          homepage: {
            [View.HOME_TRENDING_ITEMS]: [],
            [View.HOME_NEW_ITEMS]: ['0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc-1'],
            [View.HOME_SOLD_ITEMS]: [],
            [View.HOME_WEARABLES]: [],
            [View.HOME_LAND]: [],
            [View.HOME_ENS]: []
          }
        }
      } as unknown as UIState,
      nft: {
        data: {
          [itemId]: {
            id: '0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc-1',
            tokenId: '1',
            contractAddress: '0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc',
            category: NFTCategory.EMOTE,
            activeOrderId: '0xd19f0874ea5e1a9ba435d94e3ecc11f04fdfef307ef2d320c4cabf586453cdb3',
            openRentalId: null,
            owner: '0xc9c29ab98e6bc42015985165a11153f564e9f8c2',
            name: 'whispering kiss',
            image:
              'https://peer.decentraland.zone/lambdas/collections/contents/urn:decentraland:amoy:collections-v2:0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc:0/thumbnail',
            url: '/contracts/0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc/tokens/1',
            data: {
              emote: {
                bodyShapes: [BodyShape.MALE, BodyShape.FEMALE],
                category: EmoteCategory.GREETINGS,
                description: 'DESCIPTION OF THE EMOTE BSBMJASJHASVKHAJSVKAASHJLHSAVKJAHDGSDSAJ',
                rarity: Rarity.LEGENDARY,
                loop: false,
                hasSound: false,
                hasGeometry: false
              }
            },
            issuedId: '1',
            itemId: '0',
            network: Network.MATIC,
            chainId: 80002,
            createdAt: 1715107138000,
            updatedAt: 1715108766000,
            soldAt: 0,
            urn: 'urn:decentraland:amoy:collections-v2:0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc:0',
            vendor: VendorName.DECENTRALAND
          }
        },
        loading: [],
        error: null
      },
      item: {
        data: {
          [itemId]: {
            id: '0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc-1',
            beneficiary: '0xc9c29ab98e6bc42015985165a11153f564e9f8c2',
            itemId: '1',
            name: 'galactic armor',
            thumbnail:
              'https://peer.decentraland.zone/lambdas/collections/contents/urn:decentraland:amoy:collections-v2:0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc:1/thumbnail',
            url: '/contracts/0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc/items/1',
            category: NFTCategory.WEARABLE,
            contractAddress: '0x332b4067a1bcdee66abcfb3e37a47da8a0b408dc',
            rarity: Rarity.EPIC,
            available: 5000,
            isOnSale: true,
            creator: '0xc9c29ab98e6bc42015985165a11153f564e9f8c2',
            data: {
              wearable: {
                description: 'DESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTI',
                category: WearableCategory.UPPER_BODY,
                bodyShapes: [BodyShape.FEMALE],
                rarity: Rarity.RARE,
                isSmart: false
              }
            },
            network: Network.MATIC,
            chainId: 80002,
            price: '1000000000000000000',
            createdAt: 1713470731,
            updatedAt: 1713470731,
            reviewedAt: 1713470731,
            firstListedAt: 1715106572,
            soldAt: 0,
            minPrice: '1000000000000000000',
            maxListingPrice: null,
            minListingPrice: null,
            listings: 0,
            owners: null,
            picks: {
              count: 0,
              pickedByUser: false
            },
            urn: ''
          }
        },
        loading: [],
        error: null
      }
    } as unknown as RootState
  })

  describe('and has an item with the same id as an nft', () => {
    it('should have the item in home new items instead of the nft', () => {
      const result = getHomepage(state)
      expect(result[View.HOME_NEW_ITEMS]).toEqual(expect.arrayContaining([state.item.data[itemId]]))
    })
  })
})
