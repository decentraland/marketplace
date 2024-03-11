import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { AuthorizationStepStatus } from 'decentraland-ui'
import { RootState } from '../reducer'
import {
  getState,
  getData,
  getAuthorizations,
  getError,
  getLoading,
  isWaitingTxClaimName,
  getClaimNameStatus,
  getErrorMessage
} from './selectors'
import { CLAIM_NAME_REQUEST, CLAIM_NAME_TRANSACTION_SUBMITTED } from './actions'

let state: RootState

beforeEach(() => {
  state = {
    wallet: {
      data: {
        address: 'anAddress'
      }
    },
    ens: {
      data: {},
      authorizations: {},
      loading: [],
      error: null
    },
    transaction: {
      data: [],
      loading: [],
      error: null
    }
  } as any
})

describe('ENS Selectors', () => {
  describe('getState', () => {
    it('should return the ENS state', () => {
      expect(getState(state)).toEqual(state.ens)
    })
  })

  describe('getData', () => {
    it('should return the ENS data', () => {
      expect(getData(state)).toEqual(state.ens.data)
    })
  })

  describe('getAuthorizations', () => {
    it('should return the ENS authorizations', () => {
      expect(getAuthorizations(state)).toEqual(state.ens.authorizations)
    })
  })

  describe('getError', () => {
    it('should return the ENS error', () => {
      expect(getError(state)).toEqual(state.ens.error)
    })
  })

  describe('getLoading', () => {
    it('should return the ENS loading state', () => {
      expect(getLoading(state)).toEqual(state.ens.loading)
    })
  })

  describe('isWaitingTxClaimName', () => {
    describe('and it is waiting for transaction to claim a name', () => {
      beforeEach(() => {
        state.transaction.data = [
          {
            actionType: CLAIM_NAME_TRANSACTION_SUBMITTED,
            from: state.wallet?.data?.address
          } as Transaction
        ]
      })
      it('should return true', () => {
        expect(isWaitingTxClaimName(state)).toBe(true)
      })
    })
    describe('and it is not waiting for transaction to claim a name', () => {
      beforeEach(() => {
        state.transaction.data = [
          {
            actionType: 'anotherTypeOfAction',
            from: state.wallet?.data?.address
          } as Transaction
        ]
      })
      it('should return true', () => {
        expect(isWaitingTxClaimName(state)).toBe(false)
      })
    })
  })

  describe('getErrorMessage', () => {
    it('should return the ENS error message if present', () => {
      state.ens.error = { message: 'An error occurred' }
      expect(getErrorMessage(state)).toEqual('An error occurred')
    })

    it('should return null if there is no error', () => {
      state.ens.error = null
      expect(getErrorMessage(state)).toBeNull()
    })
  })

  describe('getClaimNameStatus', () => {
    describe('and CLAIM_NAME_REQUEST is loading', () => {
      beforeEach(() => {
        state.ens.loading = [{ type: CLAIM_NAME_REQUEST }]
      })
      it('should return WAITING', () => {
        expect(getClaimNameStatus(state)).toBe(AuthorizationStepStatus.WAITING)
      })
    })

    describe('and a transaction to claim a name is pending', () => {
      it('should return PROCESSING ', () => {
        state.transaction.data = [
          {
            actionType: CLAIM_NAME_TRANSACTION_SUBMITTED,
            from: state.wallet?.data?.address
          } as Transaction
        ]
        expect(getClaimNameStatus(state)).toBe(AuthorizationStepStatus.PROCESSING)
      })
    })

    describe('and there is an error in the ENS state', () => {
      it('should return ERROR', () => {
        state.ens.error = { message: 'An error occurred' }
        expect(getClaimNameStatus(state)).toBe(AuthorizationStepStatus.ERROR)
      })
    })

    describe('and no action is in progress or error', () => {
      it('should return PENDING', () => {
        expect(getClaimNameStatus(state)).toBe(AuthorizationStepStatus.PENDING)
      })
    })
  })
})
