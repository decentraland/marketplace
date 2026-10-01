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
      bid = { ...bid, paused: true }
      const [row] = formatDataToTable([bid], onAccept, '0xseller')
      renderWithProviders(<>{row[t('listings_table.offer')]}</>)
    })

    it('should disable the accept button', () => {
      expect(screen.getByRole('button', { name: t('offers_table.accept') })).toBeDisabled()
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
