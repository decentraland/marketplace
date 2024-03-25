import { connect } from 'react-redux'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { AssetType } from '../../modules/asset/types'
import { RootState } from '../../modules/reducer'
import AssetProviderPage from './AssetProviderPage'
import { MapStateProps, OwnProps } from './AssetProviderPage.types'

const mapState = (state: RootState): MapStateProps => ({
  isConnecting: isConnecting(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(AssetProviderPage) as <T extends AssetType = AssetType>(props: OwnProps<T>) => JSX.Element
