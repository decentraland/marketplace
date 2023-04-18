import { connect } from 'react-redux'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { getCurrentIdentity } from '../../../modules/identity/selectors'
import { RootState } from '../../../modules/reducer'
import { MapStateProps } from './FavoritesModal.types'
import FavoritesModal from './FavoritesModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    identity: (getCurrentIdentity(state) as AuthIdentity | null) ?? undefined
  }
}

export default connect(mapState)(FavoritesModal)
