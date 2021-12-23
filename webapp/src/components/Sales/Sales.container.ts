import { connect } from 'react-redux'
import { MapStateProps, MapDispatchProps } from './Sales.types'
import Sales from './Sales'
import { RootState } from '../../modules/reducer'
import { getSales, getCount } from '../../modules/sale/selectors'
import { getData as getItemsData } from '../../modules/item/selectors'
import { getData as getTokenData } from '../../modules/nft/selectors'
import { Asset } from '../../modules/asset/types'
import { getPage } from '../../modules/routing/selectors'
import { Dispatch } from 'redux'
import { browse } from '../../modules/routing/actions'

const mapState = (state: RootState): MapStateProps => {
  const sales = getSales(state)
  const count = getCount(state)
  const items = getItemsData(state)
  const tokens = getTokenData(state)
  const page = getPage(state)

  const assets = sales.reduce((acc, sale) => {
    const { contractAddress, itemId, tokenId } = sale
    const item = items[`${contractAddress}-${itemId}`]
    const token = tokens[`${contractAddress}-${tokenId}`]

    if (itemId && item) {
      acc[sale.id] = item
    } else if (tokenId && token) {
      acc[sale.id] = token
    }

    return acc
  }, {} as Record<string, Asset>)

  return { sales, assets, count, page }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(Sales)
