import { connect } from 'react-redux'
import { getIsFavoritesEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import { MapStateProps } from './Title.types'
import Title from './Title'

const mapState = (state: RootState): MapStateProps => ({
  isFavoritesEnabled: getIsFavoritesEnabled(state)
})

export default connect(mapState)(Title)
