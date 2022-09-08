import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { MapDispatchProps, MapStateProps } from './Sell.types'
import { RootState } from '../../../modules/reducer'
import { Metadata } from '../../Modals/TestModal/TestModal.types'
import Sell from './Sell'

const mapState = (_state: RootState): MapStateProps => ({})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onListForSale: () =>
    dispatch(
      // Open the correct modal once it is created
      openModal('TestModal', {
        title: 'Title',
        subtitle: 'Subtitle'
      } as Metadata)
    )
})

export default connect(mapState, mapDispatch)(Sell)
