import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { getView } from '../../../modules/ui/selectors'
import { MapStateProps } from './PriceChangeNotice.types'
import PriceChangeNotice from './PriceChangeNotice'

const mapState = (state: RootState): MapStateProps => ({
  view: getView(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(PriceChangeNotice)
