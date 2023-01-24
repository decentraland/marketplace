// isBuyNftsWithFiatEnabled: getIsBuyNftsWithFiatEnabled(state)

import { connect } from 'react-redux'
import { getIsBuyNftsWithFiatEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import WearableDetail from './WearableDetail'
import { MapStateProps } from './WearableDetail.types'

const mapState = (state: RootState): MapStateProps => ({
  isBuyNftsWithFiatEnabled: getIsBuyNftsWithFiatEnabled(state)
})

export default connect(mapState)(WearableDetail)
