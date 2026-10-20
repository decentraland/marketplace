import { screen, within } from '@testing-library/react'
import { ChainId, Network, NFTCategory } from '@dcl/schemas'
import { ActivityEvent, ActivityEventType } from '../../../modules/activity/types'
import { locations } from '../../../modules/routing/locations'
import { renderWithProviders } from '../../../utils/test'
import ActivityEventItem from './ActivityEventItem'

jest.mock('decentraland-dapps/dist/containers', () => ({
  ...jest.requireActual<Record<string, unknown>>('decentraland-dapps/dist/containers'),
  Profile: ({ address }: { address: string }) => <span>{address}</span>
}))

jest.mock('../../AssetProvider', () => ({
  AssetProvider: ({ children }: { children: (asset: undefined) => React.ReactNode }) => children(undefined)
}))

const transfer = {
  id: 'transfer-1',
  from: '0xflora',
  to: '0xfriend',
  contractAddress: '0xcontract',
  tokenId: '762',
  itemId: '0',
  category: NFTCategory.WEARABLE,
  txHash: '0xhash',
  timestamp: Date.now(),
  network: Network.MATIC,
  chainId: ChainId.MATIC_MAINNET
}

describe('ActivityEventItem', () => {
  describe('when the user sent an item', () => {
    it('should say who the item was sent to', () => {
      const event: ActivityEvent = {
        id: 'transfer_sent:transfer-1',
        type: ActivityEventType.TRANSFER_SENT,
        timestamp: transfer.timestamp,
        network: Network.MATIC,
        txHash: '0xhash',
        contractAddress: '0xcontract',
        tokenId: '762',
        itemId: '0',
        counterparty: '0xfriend',
        details: { transfer }
      }
      renderWithProviders(<ActivityEventItem event={event} />)
      const description = screen.getByText(/You sent/)
      expect(description).toHaveTextContent('You sent … to 0xfriend.')
      expect(within(description).getByRole('link', { name: '…' })).toHaveAttribute('href', locations.nft('0xcontract', '762'))
      expect(within(description).getByRole('link', { name: '0xfriend' })).toHaveAttribute('href', locations.account('0xfriend'))
    })
  })

  describe('when the user received an item', () => {
    it('should say who the item came from', () => {
      const event: ActivityEvent = {
        id: 'transfer_received:transfer-1',
        type: ActivityEventType.TRANSFER_RECEIVED,
        timestamp: transfer.timestamp,
        network: Network.MATIC,
        txHash: '0xhash',
        contractAddress: '0xcontract',
        tokenId: '762',
        counterparty: '0xflora',
        details: { transfer: { ...transfer, from: '0xflora', to: '0xuser', itemId: null } }
      }
      renderWithProviders(<ActivityEventItem event={event} />)
      const description = screen.getByText(/You received/)
      expect(description).toHaveTextContent('You received … from 0xflora.')
      expect(within(description).getByRole('link', { name: '0xflora' })).toHaveAttribute('href', locations.account('0xflora'))
    })
  })

  describe('when the server sends an event type this app does not know yet', () => {
    it('should render nothing instead of failing', () => {
      const event = {
        id: 'something_new:1',
        type: 'something_new',
        timestamp: Date.now(),
        network: Network.MATIC,
        details: {}
      } as unknown as ActivityEvent
      const { container } = renderWithProviders(<ActivityEventItem event={event} />)
      expect(container).toBeEmptyDOMElement()
    })
  })
})
