import { ChainId } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import {
  CLAIM_NAME_REQUEST,
  claimNameRequest,
  CLAIM_NAME_TRANSACTION_SUBMITTED,
  claimNameTransactionSubmitted,
  CLAIM_NAME_SUCCESS,
  claimNameSuccess,
  CLAIM_NAME_FAILURE,
  claimNameFailure,
  CLAIM_NAME_CLEAR,
  claimNameClear
} from './actions'
import { ENS, ENSError } from './types'

describe('claimName actions', () => {
  it('should create an action to request a name claim', () => {
    const name = 'exampleName'
    const expectedAction = {
      type: CLAIM_NAME_REQUEST,
      payload: { name }
    }
    expect(claimNameRequest(name)).toEqual(expectedAction)
  })

  it('should create an action when a name claim transaction is submitted', () => {
    const subdomain = 'exampleSubdomain'
    const address = '0xExampleAddress'
    const chainId = ChainId.ETHEREUM_MAINNET // Replace with actual ChainId
    const txHash = '0xExampleTxHash'
    const expectedAction = {
      type: CLAIM_NAME_TRANSACTION_SUBMITTED,
      payload: {
        ...buildTransactionPayload(chainId, txHash, { subdomain, address })
      }
    }
    expect(
      claimNameTransactionSubmitted(subdomain, address, chainId, txHash)
    ).toEqual(expectedAction)
  })

  it('should create an action for successful name claim', () => {
    const ens = {} as ENS
    const name = 'exampleName'
    const txHash = ''
    const expectedAction = {
      type: CLAIM_NAME_SUCCESS,
      payload: { ens, name, txHash }
    }
    expect(claimNameSuccess(ens, name, txHash)).toEqual(expectedAction)
  })

  it('should create an action for failed name claim', () => {
    const error = {} as ENSError
    const expectedAction = {
      type: CLAIM_NAME_FAILURE,
      payload: { error }
    }
    expect(claimNameFailure(error)).toEqual(expectedAction)
  })

  it('should create an action to clear name claim data', () => {
    const expectedAction = {
      type: CLAIM_NAME_CLEAR,
      payload: undefined
    }
    expect(claimNameClear()).toEqual(expectedAction)
  })
})
