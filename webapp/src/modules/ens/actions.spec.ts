import { ChainId } from '@dcl/schemas'
import { buildTransactionPayload } from 'decentraland-dapps/dist/modules/transaction/utils'
import type { Route } from 'decentraland-transactions/crossChain'
import {
  CLAIM_NAME_REQUEST,
  claimNameRequest,
  CLAIM_NAME_TRANSACTION_SUBMITTED,
  claimNameTransactionSubmitted,
  CLAIM_NAME_SUCCESS,
  claimNameSuccess,
  CLAIM_NAME_FAILURE,
  claimNameFailure,
  claimNameCrossChainRequest,
  claimNameCrossChainSuccess,
  claimNameCrossChainFailure,
  CLAIM_NAME_CROSS_CHAIN_REQUEST,
  CLAIM_NAME_CROSS_CHAIN_SUCCESS,
  CLAIM_NAME_CROSS_CHAIN_FAILURE
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

  describe('when executing the claim name request action creator', () => {
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

  describe('when executing the claim name cross chain request action creator', () => {
    beforeEach(() => {
      name = 'exampleName'
      chainId = ChainId.ETHEREUM_MAINNET
      route = {} as Route
    })

    it('should create an action to request a cross chain name claim', () => {
      expect(claimNameCrossChainRequest(name, chainId, route)).toEqual({
        type: CLAIM_NAME_CROSS_CHAIN_REQUEST,
        payload: { name, chainId, route }
      })
    })
  })

  describe('when executing the claim name transaction submitted action creator', () => {
    beforeEach(() => {
      txHash = '0xExampleTxHash'
      subdomain = 'exampleSubdomain'
      address = '0xExampleAddress'
      route = {} as Route
      chainId = ChainId.ETHEREUM_MAINNET // Replace with actual ChainId
    })

    it('should create an action to signal that a name claim transaction is submitted', () => {
      expect(claimNameTransactionSubmitted(subdomain, address, chainId, txHash, route)).toEqual({
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

  describe('when executing the claim name success action creator', () => {
    beforeEach(() => {
      name = 'exampleName'
      txHash = '0xExampleTxHash'
      ens = {} as ENS
    })

    it('should create an action to signal that a name claim is successful', () => {
      expect(claimNameSuccess({} as ENS, name, txHash)).toEqual({
        type: CLAIM_NAME_SUCCESS,
        payload: { ens, name, txHash }
      })
    })
  })

  describe('when executing the claim name cross chain action creator', () => {
    beforeEach(() => {
      name = 'exampleName'
      txHash = '0xExampleTxHash'
      ens = {} as ENS
      route = {} as Route
    })

    it('should create an action to signal that a cross chain name claim is successful', () => {
      expect(claimNameCrossChainSuccess({} as ENS, name, txHash, route)).toEqual({
        type: CLAIM_NAME_CROSS_CHAIN_SUCCESS,
        payload: { ens, name, txHash, route }
      })
    })
  })

  describe('when executing the claim name failure action creator', () => {
    let error: ENSError

    beforeEach(() => {
      name = 'exampleName'
      error = {} as ENSError
    })

    it('should create an action to signal a name claim failure', () => {
      expect(claimNameFailure(error)).toEqual({
        type: CLAIM_NAME_FAILURE,
        payload: { error }
      })
    })
  })

  describe('when executing the claim name cross chain failure action creator', () => {
    let error: string

    beforeEach(() => {
      error = 'anError'
      name = 'exampleName'
      ens = {} as ENS
      route = {} as Route
    })

    it('should create an action to signal a name claim failure', () => {
      expect(claimNameCrossChainFailure(route, name, error)).toEqual({
        type: CLAIM_NAME_CROSS_CHAIN_FAILURE,
        payload: { error, name, route }
      })
    })
  })
})
