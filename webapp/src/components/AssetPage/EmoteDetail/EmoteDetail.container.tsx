// isBuyNftsWithFiatEnabled: getIsBuyNftsWithFiatEnabled(state)

import { connect } from 'react-redux'
import { getIsBuyNftsWithFiatEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import EmoteDetail from './EmoteDetail'
import { MapStateProps } from './EmoteDetail.types'

const mapState = (state: RootState): MapStateProps => ({
  isBuyNftsWithFiatEnabled: getIsBuyNftsWithFiatEnabled(state)
})

export default connect(mapState)(EmoteDetail)
