import { RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  renderWithProviders,
  waitForComponentToFinishLoading
} from '../../utils/test'
import { SuccessPage } from './SuccessPage'
import { Props } from './SuccessPage.types'
import { NFT } from '../../modules/nft/types'
import { locations } from '../../modules/routing/locations'
import { config } from '../../config'

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
  useLocation: () => ({
    search: '?txHash=txhash&tokenId=1&contractAddress=address&assetType=nft'
  })
}))

jest.mock('lottie-react', () => () => <div>LOTTIE</div>)

function renderSuccessPage(props: Partial<Props> = {}) {
  return renderWithProviders(
    <SuccessPage isLoading={false} onNavigate={jest.fn()} {...props} />,
    {
      preloadedState: {
        nft: {
          data: {
            'address-1': {
              data: {}
            } as NFT
          },
          loading: [],
          error: null
        }
      }
    }
  )
}

let props: Partial<Props>
let screen: RenderResult

describe('when transaction is still loading', () => {
  beforeEach(async () => {
    props = { isLoading: true, onNavigate: jest.fn() }
    screen = renderSuccessPage(props)
    await waitForComponentToFinishLoading(screen)
  })

  it('should render processing transaction message', () => {
    expect(
      screen.getByText(t('success_page.loading_state.status'))
    ).toBeInTheDocument()
  })

  describe('when see progress in activity button is clicked', () => {
    it('should call onNavigate function with correct path', async () => {
      const activityButton = screen.getByRole('button', {
        name: t('success_page.loading_state.progress_in_activity')
      })
      await userEvent.click(activityButton)
      expect(props.onNavigate).toHaveBeenCalledWith(locations.activity())
    })
  })
})

describe('when transaction finishes successfully', () => {
  beforeEach(async () => {
    props = { isLoading: false, onNavigate: jest.fn() }
    screen = renderSuccessPage(props)
    await waitForComponentToFinishLoading(screen)
  })

  it('should render transaction confirmed message', () => {
    expect(
      screen.getByText(t('success_page.success_state.status'))
    ).toBeInTheDocument()
  })

  describe('when view item button is clicked', () => {
    it('should call onNavigate function with correct path', async () => {
      const viewItemButton = screen.getByRole('button', {
        name: t('success_page.success_state.view_item')
      })
      await userEvent.click(viewItemButton)
      expect(props.onNavigate).toHaveBeenCalledWith(
        locations.nft('address', '1')
      )
    })
  })

  describe('when view in explorer button clicked', () => {
    it('should call onNavigate function with correct path', async () => {
      window.open = jest.fn()
      const viewItemButton = screen.getByRole('button', {
        name: t('success_page.success_state.try_genesis_city')
      })
      await userEvent.click(viewItemButton)
      expect(window.open).toHaveBeenCalledWith(config.get('EXPLORER_URL'), "_blank")
    })
  })
})
