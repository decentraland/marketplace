import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { getTilesByEstateId } from '../../../../modules/tile/selectors'
import { MapStateProps, OwnProps } from './ParcelCoordinates.types'
import ParcelCoordinates from './ParcelCoordinates'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  parcelCoordinates: getTilesByEstateId(state)[ownProps.estateId] ?? []
})

export default connect(mapState)(ParcelCoordinates)
