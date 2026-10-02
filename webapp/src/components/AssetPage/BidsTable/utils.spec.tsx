import { screen } from '@testing-library/react'
import { Bid, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../../utils/test'
import { formatDataToTable } from './utils'

jest.mock('../../LinkedProfile', () => ({ LinkedProfile: () => <div /> }))
jest.mock('../../ManaToFiat', () => ({ ManaToFiat: () => <span /> }))

describe('when formatting the bids of an asset for its table', () => {
  let bid: Bid
  let onAccept: jest.Mock

  beforeEach(() => {
    onAccept = jest.fn()
    bid = { id: 'a-bid', bidder: '0xbidder', seller: '0xseller', price: '1', network: Network.MATIC, createdAt: 0, expiresAt: 0 } as Bid
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('and the seller sees a bid on a paused marketplace contract', () => {
    beforeEach(() => {
      bid = { ...bid, isPaused: true }
      const [row] = formatDataToTable([bid], onAccept, '0xseller')
      renderWithProviders(<>{row[t('listings_table.offer')]}</>)
    })

    it('should disable the accept button', () => {
      expect(screen.getByRole('button', { name: t('offers_table.accept') })).toBeDisabled()
    })
  })

  describe('and the bidder sees their own bid on a paused marketplace contract', () => {
    beforeEach(() => {
      bid = { ...bid, isPaused: true }
      const [row] = formatDataToTable([bid], onAccept, '0xbidder')
      renderWithProviders(<>{row[t('listings_table.offer')]}</>)
    })

    it('should mark the bid as paused', () => {
      expect(screen.getByTestId('paused-bid-badge')).toHaveTextContent(t('trading_paused_warning.label'))
    })
  })

  describe('and the bidder sees their own bid on an active marketplace contract', () => {
    beforeEach(() => {
      const [row] = formatDataToTable([bid], onAccept, '0xbidder')
      renderWithProviders(<>{row[t('listings_table.offer')]}</>)
    })

    it('should not mark the bid as paused', () => {
      expect(screen.queryByTestId('paused-bid-badge')).not.toBeInTheDocument()
    })
  })

  describe('and a visitor sees a bid on a paused marketplace contract', () => {
    beforeEach(() => {
      bid = { ...bid, isPaused: true }
      const [row] = formatDataToTable([bid], onAccept, '0xvisitor')
      renderWithProviders(<>{row[t('listings_table.offer')]}</>)
    })

    it('should not mark the bid as paused', () => {
      expect(screen.queryByTestId('paused-bid-badge')).not.toBeInTheDocument()
    })
  })

  describe('and the seller sees a bid on an active marketplace contract', () => {
    beforeEach(() => {
      const [row] = formatDataToTable([bid], onAccept, '0xseller')
      renderWithProviders(<>{row[t('listings_table.offer')]}</>)
    })

    it('should enable the accept button', () => {
      expect(screen.getByRole('button', { name: t('offers_table.accept') })).toBeEnabled()
    })
  })
})
