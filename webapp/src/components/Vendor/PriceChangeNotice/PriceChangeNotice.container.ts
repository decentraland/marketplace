import { connect } from 'react-redux'
// import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../../modules/reducer'
// import { FETCH_NFTS_REQUEST } from '../../../modules/nft/actions'
// import { getLoading } from '../../../modules/nft/selectors'
import { getView } from '../../../modules/ui/selectors'
import { MapStateProps } from './PriceChangeNotice.types'
import PriceChangeNotice from './PriceChangeNotice'

const mapState = (state: RootState): MapStateProps => ({
  view: getView(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(PriceChangeNotice)
