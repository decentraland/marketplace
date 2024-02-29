import { ChainId } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import { Route } from 'decentraland-transactions/crossChain'
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
  let name: string
  let subdomain: string
  let address: string
  let chainId: ChainId
  let txHash: string
  let ens: ENS
  let route: Route

  beforeEach(() => {
    subdomain = 'example'
    address = '0xExampleAddress'
    chainId = ChainId.ETHEREUM_MAINNET // Replace with actual ChainId
  })
  describe('when handling the CLAIM_NAME_REQUEST action', () => {
    beforeEach(() => {
      name = 'exampleName'
    })
    it('should create an action to request a name claim', () => {
      expect(claimNameRequest(name)).toEqual({
        type: CLAIM_NAME_REQUEST,
        payload: { name }
      })
    })
  })

  describe('when handling the CLAIM_NAME_TRANSACTION_SUBMITTED action', () => {
    beforeEach(() => {
      txHash = '0xExampleTxHash'
      subdomain = 'exampleSubdomain'
      address = '0xExampleAddress'
      route = {} as Route
      chainId = ChainId.ETHEREUM_MAINNET // Replace with actual ChainId
    })
    it('should create an action when a name claim transaction is submitted', () => {
      expect(
        claimNameTransactionSubmitted(
          subdomain,
          address,
          chainId,
          txHash,
          route
        )
      ).toEqual({
        type: CLAIM_NAME_TRANSACTION_SUBMITTED,
        payload: {
          ...buildTransactionPayload(chainId, txHash, {
            subdomain,
            address,
            route
          })
        }
      })
    })
  })

  describe('when handling the CLAIM_NAME_SUCCESS action', () => {
    beforeEach(() => {
      name = 'exampleName'
      txHash = '0xExampleTxHash'
      ens = {} as ENS
    })
    it('should create an action when a name claim is successful', () => {
      expect(claimNameSuccess({} as ENS, name, txHash)).toEqual({
        type: CLAIM_NAME_SUCCESS,
        payload: { ens, name, txHash }
      })
    })
  })

  describe('when handling the CLAIM_NAME_FAILURE action', () => {
    beforeEach(() => {
      name = 'exampleName'
    })
    it('should create an action when a name claim fails', () => {
      const error = {} as ENSError
      expect(claimNameFailure(error)).toEqual({
        type: CLAIM_NAME_FAILURE,
        payload: { error }
      })
    })
  })

  describe('when handling the CLAIM_NAME_CLEAR action', () => {
    it('should create an action to clear name claim data', () => {
      expect(claimNameClear()).toEqual({
        type: CLAIM_NAME_CLEAR,
        payload: undefined
      })
    })
  })
})
