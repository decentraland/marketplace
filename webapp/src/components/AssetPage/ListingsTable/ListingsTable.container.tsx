import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { MapDispatchProps, MapDispatch } from './ListingsTable.types'
import ListingsTable from './ListingsTable'

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(null, mapDispatch)(ListingsTable)
