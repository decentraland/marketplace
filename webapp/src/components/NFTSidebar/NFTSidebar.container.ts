import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { getUISection } from '../../modules/ui/selectors'
import { MapStateProps } from './NFTSidebar.types'
import NFTSidebar from './NFTSidebar'

const mapState = (state: RootState): MapStateProps => ({
  section: getUISection(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(NFTSidebar)
