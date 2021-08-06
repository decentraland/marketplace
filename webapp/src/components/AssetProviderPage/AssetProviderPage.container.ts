import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { AssetType } from '../../modules/asset/types'
import { isConnecting } from '../../modules/wallet/selectors'
import { MapStateProps, OwnProps } from './AssetProviderPage.types'
import AssetProviderPage from './AssetProviderPage'

const mapState = (state: RootState): MapStateProps => ({
  isConnecting: isConnecting(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(AssetProviderPage) as <
  T extends AssetType = AssetType
>(
  props: OwnProps<T>
) => JSX.Element
