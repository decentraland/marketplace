import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import ItemDetail from './ItemDetail'
import { MapDispatchProps } from './ItemDetail.types'

const mapState = () => ({})

const mapDispatch = (_dispatch: Dispatch): MapDispatchProps => ({
    
})

export default connect(mapState, mapDispatch)(ItemDetail)
