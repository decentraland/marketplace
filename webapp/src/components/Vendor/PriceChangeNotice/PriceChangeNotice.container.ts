import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getView } from '../../../modules/ui/browse/selectors'
import PriceChangeNotice from './PriceChangeNotice'
import { MapStateProps } from './PriceChangeNotice.types'

const mapState = (state: RootState): MapStateProps => ({
  view: getView(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(PriceChangeNotice)
