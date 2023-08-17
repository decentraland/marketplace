import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { getTilesByEstateId } from '../../../../modules/tile/selectors'
import ParcelCoordinates from './ParcelCoordinates'
import { MapStateProps, OwnProps } from './ParcelCoordinates.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  parcelCoordinates: getTilesByEstateId(state)[ownProps.estateId] ?? []
})

export default connect(mapState)(ParcelCoordinates)
