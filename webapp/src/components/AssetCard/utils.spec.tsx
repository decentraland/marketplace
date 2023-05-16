import { BigNumber, ethers } from 'ethers'
import { CatalogSortBy, Item } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { BrowseOptions, SortBy } from '../../modules/routing/types'
import {
  getAlsoAvailableForMintingText,
  getAssetListingsRangeInfoText,
  getCatalogCardInformation,
  getListingsRangePrice
} from './utils'
import mintingIcon from '../../images/minting.png'

const applyRange = (
  appliedFilters: Pick<BrowseOptions, 'minPrice' | 'maxPrice' | 'sortBy'>
) => {
  return (appliedFilters = {
    ...appliedFilters,
    minPrice: '100',
    maxPrice: '1000'
  })
}

describe('AssetCard utils', () => {
  describe('getCatalogCardInformation', () => {
    let asset: Item
    let price: string
    let maxListingPrice: string
    let minListingPrice: string
    let appliedFilters: Pick<BrowseOptions, 'minPrice' | 'maxPrice' | 'sortBy'>

    describe('when the asset is not for sale', () => {
      beforeEach(() => {
        appliedFilters = {}
        asset = {
          isOnSale: false,
          available: 0,
          listings: 0
        } as Item
      })
      it('should show "Not for sale" title, no icon, no extra information and no price', () => {
        const result = getCatalogCardInformation(asset, appliedFilters)
        expect(result).toEqual({
          action: 'Not for sale',
          actionIcon: null,
          extraInformation: null,
          price: null
        })
      })
    })

    describe('when sorting by CHEAPEST', () => {
      beforeEach(() => {
        appliedFilters = {
          sortBy: SortBy.CHEAPEST
        }
      })
      describe('when the asset has only mint', () => {
        beforeEach(() => {
          price = ethers.utils.parseUnits('100').toString()
          asset = {
            isOnSale: true,
            available: 1,
            listings: 0,
            price,
            minPrice: price
          } as Item
        })
        it('should show "Chepeast Option" title, no icon, no extra information and the price', () => {
          const result = getCatalogCardInformation(asset, appliedFilters)
          expect(result).toEqual({
            action: t('asset_card.cheapest_option'),
            actionIcon: null,
            extraInformation: null,
            price
          })
        })
      })

      describe('when the asset has only listings', () => {
        beforeEach(() => {
          price = ethers.utils.parseUnits('100').toString()
          asset = {
            isOnSale: true,
            available: 0,
            listings: 1,
            price,
            minPrice: price
          } as Item
        })
        describe('when the asset has only one listing', () => {
          it('should show "Chepeast Option" title, no icon, the price and no extra section', () => {
            const result = getCatalogCardInformation(asset, appliedFilters)
            expect(result).toEqual({
              action: t('asset_card.cheapest_option'),
              actionIcon: null,
              extraInformation: null,
              price
            })
          })
        })
        describe('when the asset has more than one listing', () => {
          beforeEach(() => {
            minListingPrice = ethers.utils.parseUnits('100').toString()
            maxListingPrice = ethers.utils.parseUnits('1000').toString()
            asset = {
              ...asset,
              listings: 2,
              minListingPrice,
              maxListingPrice
            }
          })
          it('should show "Chepeast Option" title, no icon, the price and the listings range in the extra section', () => {
            const result = getCatalogCardInformation(asset, appliedFilters)
            expect(result).toEqual({
              action: t('asset_card.cheapest_option'),
              actionIcon: null,
              extraInformation: getAssetListingsRangeInfoText(asset),
              price
            })
          })
        })
      })

      describe('when the asset has both mint and listings', () => {
        beforeEach(() => {
          price = ethers.utils.parseUnits('100').toString()
          minListingPrice = ethers.utils.parseUnits('100').toString()
          maxListingPrice = ethers.utils.parseUnits('1000').toString()
          asset = {
            isOnSale: true,
            available: 1,
            listings: 1,
            price,
            minPrice: minListingPrice,
            minListingPrice,
            maxListingPrice
          } as Item
        })
        describe('and there is a range of prices applied', () => {
          beforeEach(() => {
            appliedFilters = applyRange(appliedFilters)
          })

          describe('and the minting price is less than the range min', () => {
            beforeEach(() => {
              asset = {
                ...asset,
                price: BigNumber.from(
                  ethers.utils.parseUnits(appliedFilters.minPrice as string)
                )
                  .sub(BigNumber.from(1))
                  .toString()
              }
            })
            it('should show "Chepeast Option" title, no icon, the min price and the mint option in the extra section', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.cheapest_option_range'),
                actionIcon: null,
                extraInformation: getAlsoAvailableForMintingText(asset),
                price: asset.minPrice
              })
            })
          })
          describe('and the minting price is greater than the range max', () => {
            beforeEach(() => {
              asset = {
                ...asset,
                price: BigNumber.from(
                  ethers.utils.parseUnits(appliedFilters.maxPrice as string)
                )
                  .add(BigNumber.from(1))
                  .toString()
              }
            })
            it('should show "Chepeast Option" title, no icon, the min price and no extra section', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.cheapest_option_range'),
                actionIcon: null,
                extraInformation: null,
                price: asset.minPrice
              })
            })
          })
        })

        describe('and there is no range of prices applied', () => {
          describe('and the mint price is the cheapest option', () => {
            beforeEach(() => {
              asset = {
                ...asset,
                price: asset.minPrice as string
              }
            })
            it('should show "Chepeast Option" title, no icon, the min price and no extra section', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.cheapest_option'),
                actionIcon: null,
                extraInformation: null,
                price: asset.minPrice
              })
            })
          })
          describe('and the mint price is not the cheapest option', () => {
            beforeEach(() => {
              asset = {
                ...asset,
                price: BigNumber.from(asset.minPrice as string)
                  .add(1)
                  .toString()
              }
            })
            it('should show "Chepeast Option" title, no icon, the min price and the mint option in the extra section', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.cheapest_option'),
                actionIcon: null,
                extraInformation: getAlsoAvailableForMintingText(asset),
                price: asset.minPrice
              })
            })
          })
        })
      })
    })

    describe('when sorting by MOST_EXPENSIVE', () => {
      beforeEach(() => {
        price = ethers.utils.parseUnits('5').toString()
        minListingPrice = ethers.utils.parseUnits('100').toString()
        maxListingPrice = ethers.utils.parseUnits('999').toString()
        asset = {
          isOnSale: true,
          available: 1,
          listings: 2,
          price,
          minPrice: price,
          minListingPrice,
          maxListingPrice
        } as Item
        appliedFilters = {
          sortBy: SortBy.MOST_EXPENSIVE
        }
      })
      describe('and there is a range applied', () => {
        beforeEach(() => {
          appliedFilters = applyRange(appliedFilters)
        })
        describe('and the minting is in range', () => {
          beforeEach(() => {
            asset = {
              ...asset,
              price: ethers.utils
                .parseUnits(appliedFilters.maxPrice as string)
                .sub(1)
                .toString()
            }
          })
          describe('and minting is more expensive than the max listing', () => {
            beforeEach(() => {
              asset = {
                ...asset,
                maxListingPrice: BigNumber.from(asset.price)
                  .sub(1)
                  .toString()
              }
            })
            it('should show most expensive in range title, no icon, the minting price and the listings range in the extra section', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.most_expensive_range'),
                actionIcon: null,
                extraInformation: getAssetListingsRangeInfoText(asset),
                price: asset.price
              })
            })
          })
          describe('and minting is less expensive than the max listing', () => {
            beforeEach(() => {
              asset = {
                ...asset,
                maxListingPrice: BigNumber.from(asset.price)
                  .add(1)
                  .toString()
              }
            })
            it('should show "Most Expensive" title, no icon, the max listing price and the listings range in the extra section', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.most_expensive_range'),
                actionIcon: null,
                extraInformation: getAssetListingsRangeInfoText(asset),
                price: asset.maxListingPrice
              })
            })
          })
        })
        describe('and the minting is out of range', () => {
          beforeEach(() => {
            asset = {
              ...asset,
              price: BigNumber.from(
                ethers.utils.parseUnits(appliedFilters.maxPrice as string)
              )
                .add(1)
                .toString()
            }
          })
          it('should show "Most Expensive" title, no icon, the max listing price and the listings range in the extra section', () => {
            const result = getCatalogCardInformation(asset, appliedFilters)
            expect(result).toEqual({
              action: t('asset_card.most_expensive_range'),
              actionIcon: null,
              extraInformation: getAssetListingsRangeInfoText(asset),
              price: asset.maxListingPrice
            })
          })
        })
      })
      describe('and there is no range applied', () => {
        it('should show most expensive title, no icon, the listing max price and the listings range in the extra section', () => {
          const result = getCatalogCardInformation(asset, appliedFilters)
          expect(result).toEqual({
            action: t('asset_card.most_expensive'),
            actionIcon: null,
            extraInformation: getAssetListingsRangeInfoText(asset),
            price: asset.maxListingPrice
          })
        })
      })
    })

    describe.each(
      Object.values(CatalogSortBy).filter(
        sortBy =>
          sortBy !== CatalogSortBy.CHEAPEST &&
          sortBy !== CatalogSortBy.MOST_EXPENSIVE
      )
    )('when sorting by %s', sort => {
      beforeEach(() => {
        asset = {
          isOnSale: true,
          available: 1,
          listings: 2,
          price: '100',
          minPrice: '100',
          minListingPrice: '100',
          maxListingPrice: '100'
        } as Item
        appliedFilters = {
          sortBy: (sort as unknown) as SortBy
        }
      })
      describe('and there is only mint available', () => {
        beforeEach(() => {
          asset = {
            ...asset,
            listings: 0
          }
        })
        it('should show the mint title, mint icon, the mint price and no extra section', () => {
          const result = getCatalogCardInformation(asset, appliedFilters)
          expect(result).toEqual({
            action: t('asset_card.available_for_mint'),
            actionIcon: mintingIcon,
            extraInformation: null,
            price: asset.price
          })
        })
      })
      describe('and there is only listings available', () => {
        beforeEach(() => {
          asset = {
            ...asset,
            available: 0,
            isOnSale: false,
            minPrice: '10',
            minListingPrice: '10',
            maxListingPrice: '100'
          }
        })
        describe('and has just 1 listing', () => {
          beforeEach(() => {
            asset = {
              ...asset,
              listings: 1
            }
          })
          it('should show cheapest listing label, no icon, the min price and no extra section', () => {
            const result = getCatalogCardInformation(asset, appliedFilters)
            expect(result).toEqual({
              action: t('asset_card.cheapest_listing'),
              actionIcon: null,
              extraInformation: null,
              price: asset.minListingPrice
            })
          })
        })
        describe('and has more than 1 listing', () => {
          beforeEach(() => {
            asset = {
              ...asset,
              listings: 2
            }
          })
          describe('and has a range applied', () => {
            beforeEach(() => {
              appliedFilters = applyRange(appliedFilters)
            })
            it('should show the listings in range label, no icon, the range price and no extra section', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.available_listings_in_range'),
                actionIcon: null,
                extraInformation: null,
                price: getListingsRangePrice(asset)
              })
            })
          })
        })
      })
      describe('and there is mint and listings available', () => {
        beforeEach(() => {
          asset = {
            ...asset,
            available: 10,
            listings: 999,
            isOnSale: true,
            minPrice: '10',
            minListingPrice: '10',
            maxListingPrice: '100'
          }
        })
        describe('and has a range applied', () => {
          beforeEach(() => {
            appliedFilters = applyRange(appliedFilters)
          })
          describe('and minting is in range', () => {
            beforeEach(() => {
              asset = {
                ...asset,
                price: BigNumber.from(
                  ethers.utils.parseUnits(appliedFilters.maxPrice as string)
                )
                  .sub(1)
                  .toString()
              }
            })
            it('should show the available for mint label, mint icon and the listings range in the extra information', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.available_for_mint'),
                actionIcon: mintingIcon,
                extraInformation: getAssetListingsRangeInfoText(asset),
                price: asset.price
              })
            })
          })
          describe('and minting is less than the min range price', () => {
            beforeEach(() => {
              asset = {
                ...asset,
                price: BigNumber.from(
                  ethers.utils.parseUnits(appliedFilters.minPrice as string)
                )
                  .sub(1)
                  .toString()
              }
            })
            it('should show the available listings in range label, no icon and the minting price in the extra information', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.available_listings_in_range'),
                actionIcon: null,
                extraInformation: getAlsoAvailableForMintingText(asset),
                price: asset.minListingPrice
              })
            })
          })
          describe('and minting is higher than the max range price', () => {
            beforeEach(() => {
              asset = {
                ...asset,
                price: BigNumber.from(
                  ethers.utils.parseUnits(appliedFilters.maxPrice as string)
                )
                  .add(1)
                  .toString()
              }
            })
            it('should show the available listings in range label, no icon and the no the extra information', () => {
              const result = getCatalogCardInformation(asset, appliedFilters)
              expect(result).toEqual({
                action: t('asset_card.available_listings_in_range'),
                actionIcon: null,
                extraInformation: null,
                price: asset.minListingPrice
              })
            })
          })
        })
        describe('and has no range applied', () => {
          it('should show the available for mint label, mint icon and the listings range in the extra information', () => {
            const result = getCatalogCardInformation(asset, appliedFilters)
            expect(result).toEqual({
              action: t('asset_card.available_for_mint'),
              actionIcon: mintingIcon,
              extraInformation: getAssetListingsRangeInfoText(asset),
              price: asset.price
            })
          })
        })
      })
    })
  })
})
