import { createSelector } from 'reselect'
import { RootState } from '../reducer'
import { UIState } from '../ui/reducer'
import { OrderState } from '../order/reducer'
import { Order } from '../order/types'
import { getData } from '../order/selectors'
import { getSearch } from 'connected-react-router'
import { MarketSortBy, MarketSection } from '../routing/locations'

export const getState = (state: RootState) => state.ui
export const getMarketOrders = createSelector<
  RootState,
  UIState,
  OrderState['data'],
  Order[]
>(getState, getData, (ui, ordersById) =>
  ui.marketOrderIds.map(id => ordersById[id])
)
export const getMarketPage = createSelector<RootState, string, number>(
  getSearch,
  search => {
    const page = new URLSearchParams(search).get('page')
    return page === null || isNaN(+page) ? 1 : +page
  }
)

export const getMarketSection = createSelector<
  RootState,
  string,
  MarketSection
>(getSearch, search => {
  const section = new URLSearchParams(search).get('section')
  if (section && Object.values(MarketSection).includes(section as any)) {
    return section as MarketSection
  }
  return MarketSection.ALL
})

export const getMarketSortBy = createSelector<RootState, string, MarketSortBy>(
  getSearch,
  search => {
    const sortBy = new URLSearchParams(search).get('sortBy')
    if (sortBy) {
      return sortBy as MarketSortBy
    }
    return MarketSortBy.NEWEST
  }
)
