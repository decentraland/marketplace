import { AnyAction, Reducer } from 'redux'
import { Bid } from '@dcl/schemas'
import { archiveBid, unarchiveBid } from './bid/actions'
import { createRootReducer, RootState } from './reducer'
import { PERSISTED_PATHS } from './storage'

function resolve(state: RootState, path: string[]): unknown {
  return path.reduce<unknown>(
    (branch, key) => (branch && typeof branch === 'object' ? (branch as Record<string, unknown>)[key] : undefined),
    state
  )
}

describe('when persisting state to localStorage', () => {
  let reducer: Reducer<RootState>
  let initialState: RootState

  beforeEach(() => {
    reducer = createRootReducer()
    initialState = reducer(undefined, { type: '@@INIT' } as AnyAction)
  })

  describe('and resolving every persisted path against the root reducer', () => {
    let unresolved: string[][]

    beforeEach(() => {
      unresolved = PERSISTED_PATHS.filter(path => resolve(initialState, path) === undefined)
    })

    it('should leave none of them undefined, since the storage middleware silently drops the ones that are', () => {
      expect(unresolved).toEqual([])
    })
  })

  describe('and a bid is archived', () => {
    let archivedPath: string[]
    let bid: Bid
    let state: RootState

    beforeEach(() => {
      archivedPath = ['ui', 'asset', 'bid', 'archived']
      bid = { id: 'a-bid-id' } as Bid
      state = reducer(initialState, archiveBid(bid) as AnyAction)
    })

    it('should mirror the branch the bid was written to', () => {
      expect(PERSISTED_PATHS).toContainEqual(archivedPath)
    })

    it('should store the bid id at that path', () => {
      expect(resolve(state, archivedPath)).toEqual([bid.id])
    })

    describe('and the same bid is unarchived again', () => {
      beforeEach(() => {
        state = reducer(state, unarchiveBid(bid) as AnyAction)
      })

      it('should drop the bid id from that path', () => {
        expect(resolve(state, archivedPath)).toEqual([])
      })
    })
  })
})
