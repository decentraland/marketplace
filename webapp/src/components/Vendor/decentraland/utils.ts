import { browse as browseAction } from '../../../modules/routing/actions'
import { LANDFilters } from './types'

export function browseRentedLAND(
  browse: typeof browseAction,
  filter: LANDFilters
): void {
  switch (filter) {
    case LANDFilters.ALL_LAND:
      browse({ onlyOnSale: undefined, onlyOnRent: undefined })
      break
    case LANDFilters.ONLY_FOR_RENT:
      browse({ onlyOnSale: undefined, onlyOnRent: true })
      break
    case LANDFilters.ONLY_FOR_SALE:
      browse({ onlyOnSale: true, onlyOnRent: undefined })
      break
  }
}
