import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { MapStateProps } from './Title.types'
import Title from './Title'
import { getIsFavoritesEnabled } from '../../../modules/features/selectors'

const mapState = (state: RootState): MapStateProps => ({
  isFavoritesEnabled: getIsFavoritesEnabled(state)
})

export default connect(mapState)(Title)
