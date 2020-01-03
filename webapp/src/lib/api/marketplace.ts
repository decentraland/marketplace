import { Order } from '../../modules/order/types'
import { FetchOrderOptions } from '../../modules/order/actions'

export const MARKETPLACE_URL = process.env.REACT_APP_MARKETPLACE_URL

const getMarketQuery = (options: FetchOrderOptions) => {
  let where = ['status: "open"']
  if (options.category) {
    where.push(`category: "${options.category}"`)
  }
  let filters = [
    `first: ${options.first}`,
    `skip: ${options.skip}`,
    `where: { ${where.join(',')} }`
  ]
  if (options.orderBy) {
    filters.push(`orderBy: "${options.orderBy}"`)
  }
  if (options.orderDirection) {
    filters.push(`orderDirection: "${options.orderDirection}"`)
  }
  return `
{
  orders(${filters.join(',')}) {
    id
    nft {
      tokenId
      name
      image
      parcel {
        x
        y
      }
      estate {
        size
      }
      wearable {
        rarity
      }
    }
    owner
    price
    category
    status
    expiresAt
    createdAt
    updatedAt
  }
}
`
}

class MarketplaceAPI {
  fetchOrders = async (options: FetchOrderOptions) => {
    const resp = await fetch(MARKETPLACE_URL!, {
      method: 'post',
      body: JSON.stringify({ query: getMarketQuery(options) })
    })
    const json = await resp.json()
    return json.data.orders as Order[]
  }
}

export const marketplace = new MarketplaceAPI()
