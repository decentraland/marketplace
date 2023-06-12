import { RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NFTCategory, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  renderWithProviders,
  waitForComponentToFinishLoading
} from '../../utils/test'
import { NFT } from '../../modules/nft/types'
import { locations } from '../../modules/routing/locations'
import { config } from '../../config'
import { SuccessPage } from './SuccessPage'
import { Props } from './SuccessPage.types'

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
  useLocation: () => ({
    search: '?txHash=txhash&tokenId=1&contractAddress=address&assetType=nft'
  })
}))

jest.mock('lottie-react', () => () => <div>LOTTIE</div>)

function renderSuccessPage(props: Partial<Props> = {}) {
  return renderWithProviders(
    <SuccessPage isLoading={false} issuedId={null} {...props} />,
    {
      preloadedState: {
        nft: {
          data: {
            'address-1': {
              data: {
                wearable: {
                  rarity: Rarity.COMMON
                }
              },
              category: NFTCategory.WEARABLE,
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
    props = { isLoading: true }
    screen = renderSuccessPage(props)
    await waitForComponentToFinishLoading(screen)
  })

  it('should render processing transaction message', () => {
    expect(
      screen.getByText(t('success_page.loading_state.status'))
    ).toBeInTheDocument()
  })
})

describe('when transaction finishes successfully', () => {
  beforeEach(async () => {
    props = { isLoading: false }
    screen = renderSuccessPage(props)
    await waitForComponentToFinishLoading(screen)
  })

  it('should render transaction confirmed message', () => {
    expect(
      screen.getByText(t('success_page.success_state.status'))
    ).toBeInTheDocument()
  })
})
