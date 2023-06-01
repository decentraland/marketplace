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
// import { Item } from '@dcl/schemas'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  console.log(state)
  console.log(ownProps)
  return {
    items: getPreviewListItems(state, ownProps.list.id)
    //   items: [
    //     {
    //       thumbnail:
    //         'https://peer.decentraland.zone/lambdas/collections/contents/urn:decentraland:mumbai:collections-v2:0xb726634ed82ac04e6bca66b3b97cc41a2c10ec31:0/thumbnail'
    //     } as Item
    //   ]
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
