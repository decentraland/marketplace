import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatchProps, MapDispatch } from './SuccessPage.types'
import { SuccessPage } from './SuccessPage'
import { getTransaction } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { getTransactions } from '../../modules/transaction/selectors'

const mapState = (state: RootState): MapStateProps => {
  const txHash = "0x4df117236cff95a4027ce467483d84051786051e33bf51b0724ccad3c956e917"
  const transaction = getTransaction(state, txHash)
  console.log(getTransactions(state))
  console.log({transaction})
  return {
    isLoading: true
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: (path: string) => dispatch(push(path)),
})

export default connect(mapState, mapDispatch)(SuccessPage)
