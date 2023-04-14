import { connect } from 'react-redux'
import { getIsFavoritesEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import { MapStateProps } from './BaseDetail.types'
import BaseDetail from './BaseDetail'

const mapState = (state: RootState): MapStateProps => ({
  isFavoritesEnabled: getIsFavoritesEnabled(state)
})

export default connect(mapState)(BaseDetail)
