import { createSelector } from 'reselect'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { RootState } from '../reducer'
import { getTransactions } from '../transaction/selectors'
import { ActivityEvent } from './types'

export const getState = (state: RootState) => state.activity
export const getData = (state: RootState) => getState(state).data
export const getTotal = (state: RootState) => getState(state).total
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export type MergedActivityItem =
  | { kind: 'local'; tx: Transaction; timestamp: number }
  | { kind: 'server'; event: ActivityEvent; timestamp: number }

// Merge local transactions (decentraland-dapps state, persisted in localStorage)
// with server-side ActivityEvents. When the same on-chain transaction shows up in
// both, keep the LOCAL one (user choice: preserves pending state and the precise
// signing-time ordering). Result is sorted DESC by timestamp.
export const getMergedActivity = createSelector<RootState, Transaction[], ActivityEvent[], MergedActivityItem[]>(
  getTransactions,
  getData,
  (localTxs, serverEvents) => {
    const localHashes = new Set(localTxs.map(tx => tx.hash?.toLowerCase()).filter((h): h is string => !!h))
    const dedupedServer = serverEvents.filter(ev => !ev.txHash || !localHashes.has(ev.txHash.toLowerCase()))

    const merged: MergedActivityItem[] = [
      ...localTxs.map(tx => ({ kind: 'local' as const, tx, timestamp: tx.timestamp ?? 0 })),
      ...dedupedServer.map(event => ({ kind: 'server' as const, event, timestamp: event.timestamp }))
    ]

    return merged.sort((a, b) => b.timestamp - a.timestamp)
  }
)
