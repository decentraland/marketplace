import { connect } from 'react-redux'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { getCurrentIdentity } from '../../../modules/identity/selectors'
import { RootState } from '../../../modules/reducer'
import FavoritesModal from './FavoritesModal'
import { MapStateProps } from './FavoritesModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    identity: (getCurrentIdentity(state) as AuthIdentity | null) ?? undefined
  }
}

export default connect(mapState)(FavoritesModal)
