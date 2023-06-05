import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getPreviewListItems } from '../../../modules/favorites/selectors'
import { RootState } from '../../../modules/reducer'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps,
  OwnProps
} from './ListCard.types'
import ListCard from './ListCard'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  return {
    items: getPreviewListItems(state, ownProps.list.id)
  }
}

const mapDispatch = (
  dispatch: MapDispatch,
  ownProps: OwnProps
): MapDispatchProps =>
  bindActionCreators(
    {
      onEditList: () => openModal('EditListModal', { list: ownProps.list }),
      onDeleteList: () =>
        openModal('CreateOrEditListModal', { list: ownProps.list })
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(ListCard)
