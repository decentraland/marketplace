import { browse as browseAction } from '../../../modules/routing/actions'
import { LANDStatus } from './types'

export function browseRentedLAND(
  browse: typeof browseAction,
  filter: LANDStatus
): void {
  switch (filter) {
    case LANDStatus.ALL_LAND:
      browse({ onlyOnSale: undefined, onlyOnRent: undefined })
      break
    case LANDStatus.ONLY_FOR_RENT:
      browse({ onlyOnSale: undefined, onlyOnRent: true })
      break
    case LANDStatus.ONLY_FOR_SALE:
      browse({ onlyOnSale: true, onlyOnRent: undefined })
      break
  }
}
