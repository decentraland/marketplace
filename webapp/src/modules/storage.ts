import { CLEAR_TRANSACTIONS } from 'decentraland-dapps/dist/modules/transaction/actions'
import { ARCHIVE_BID, UNARCHIVE_BID } from './bid/actions'
import { SET_IS_TRYING_ON } from './ui/preview/actions'

/**
 * State branches mirrored into localStorage. The storage middleware silently skips any path
 * that resolves to `undefined`, so a rename on either side stops persisting without an error.
 * `storage.spec.ts` asserts every path still resolves against the root reducer.
 *
 * Keep `loadStorageMiddleware` running before anything can dispatch a persisted action: the
 * loader merges with lodash.merge, which combines arrays by index rather than replacing them,
 * so a branch like `archived` only restores cleanly while its destination is still empty.
 */
export const PERSISTED_PATHS: string[][] = [
  ['ui', 'asset', 'bid', 'archived'],
  ['ui', 'preview', 'isTryingOn']
]

/** Actions that trigger a write of `PERSISTED_PATHS` to localStorage. */
export const PERSISTED_ACTIONS: string[] = [CLEAR_TRANSACTIONS, ARCHIVE_BID, UNARCHIVE_BID, SET_IS_TRYING_ON]
