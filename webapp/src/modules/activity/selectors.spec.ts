import { Network } from '@dcl/schemas'
import { Transaction, TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { RootState } from '../reducer'
import { INITIAL_STATE as INITIAL_ACTIVITY_STATE } from './reducer'
import { getMergedActivity } from './selectors'
import { ActivityEvent, ActivityEventType } from './types'

const makeTx = (overrides: Partial<Transaction> = {}): Transaction =>
  ({
    hash: '0xLOCAL',
    actionType: 'BUY_ITEM_SUCCESS',
    from: '0xuser',
    status: TransactionStatus.PENDING,
    timestamp: 5000,
    chainId: 137,
    payload: {},
    url: 'https://etherscan.io/tx/0xLOCAL',
    nonce: 1,
    replacedBy: null,
    withReceipt: false,
    isCrossChain: false,
    ...(overrides as object)
  } as unknown as Transaction)

const makeServerEvent = (overrides: Partial<ActivityEvent> = {}): ActivityEvent =>
  ({
    id: 'sale:1',
    type: ActivityEventType.SALE_BUYER,
    timestamp: 1000,
    network: Network.MATIC,
    txHash: '0xSERVER',
    contractAddress: '0xnft',
    tokenId: '1',
    price: '100',
    counterparty: '0xseller',
    details: {} as any,
    ...overrides
  } as ActivityEvent)

const makeState = (txs: Transaction[], events: ActivityEvent[]): RootState =>
  ({
    transaction: { data: txs, loading: [], error: null },
    wallet: { data: { address: '0xuser' }, loading: [], error: null },
    activity: { ...INITIAL_ACTIVITY_STATE, data: events, total: events.length }
  } as unknown as RootState)

describe('getMergedActivity', () => {
  describe('when local and server have no overlap', () => {
    it('should include both, sorted DESC by timestamp', () => {
      const localTx = makeTx({ hash: '0xa', timestamp: 5000 })
      const serverEvent = makeServerEvent({ id: 's:1', txHash: '0xb', timestamp: 1000 })
      const state = makeState([localTx], [serverEvent])

      const merged = getMergedActivity(state)
      expect(merged).toHaveLength(2)
      expect(merged[0].kind).toBe('local')
      expect(merged[1].kind).toBe('server')
    })
  })

  describe('when a local tx has the same hash as a server event', () => {
    it('should drop the server event (prefer-local dedup)', () => {
      const sharedHash = '0xSHARED'
      const localTx = makeTx({ hash: sharedHash, timestamp: 5000 })
      const serverEvent = makeServerEvent({ id: 's:1', txHash: sharedHash, timestamp: 1000 })

      const merged = getMergedActivity(makeState([localTx], [serverEvent]))
      expect(merged).toHaveLength(1)
      expect(merged[0].kind).toBe('local')
    })

    it('should be case-insensitive on the txHash match', () => {
      const localTx = makeTx({ hash: '0xABCDEF', timestamp: 5000 })
      const serverEvent = makeServerEvent({ id: 's:1', txHash: '0xabcdef', timestamp: 1000 })

      const merged = getMergedActivity(makeState([localTx], [serverEvent]))
      expect(merged).toHaveLength(1)
      expect(merged[0].kind).toBe('local')
    })
  })

  describe('when a server event has no txHash', () => {
    it('should NOT be deduped against local txs', () => {
      const localTx = makeTx({ hash: '0xLOCAL', timestamp: 5000 })
      const serverEvent = makeServerEvent({ id: 's:1', txHash: undefined, timestamp: 1000 })

      const merged = getMergedActivity(makeState([localTx], [serverEvent]))
      expect(merged).toHaveLength(2)
    })
  })

  describe('when there are many items', () => {
    it('should sort all items by timestamp DESC', () => {
      const local = [makeTx({ hash: '0x1', timestamp: 5000 }), makeTx({ hash: '0x2', timestamp: 9000 })]
      const server = [
        makeServerEvent({ id: 's:1', txHash: '0xa', timestamp: 1000 }),
        makeServerEvent({ id: 's:2', txHash: '0xb', timestamp: 7000 })
      ]

      const merged = getMergedActivity(makeState(local, server))
      const timestamps = merged.map(m => m.timestamp)
      expect(timestamps).toEqual([9000, 7000, 5000, 1000])
    })
  })
})
