import { RenderResult } from '@testing-library/react'
import { NFTCategory, Profile, Rarity } from '@dcl/schemas'
import { useLocation } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders, waitForComponentToFinishLoading } from '../../utils/test'
import { NFT } from '../../modules/nft/types'
import { SuccessPage } from './SuccessPage'
import { Props } from './SuccessPage.types'

jest.mock('react-router-dom', () => {
  const module = jest.requireActual('react-router-dom')
  return {
    ...module,
    useHistory: jest.fn(),
    useLocation: jest.fn()
  } as unknown
})

let useLocationMock: { search: string; pathname: string }

jest.mock('lottie-react', () => () => <div>LOTTIE</div>)

function renderSuccessPage(props: Partial<Props> = {}, preloadedNFTData?: Record<string, NFT>): RenderResult {
  return renderWithProviders(
    <SuccessPage profile={undefined} onSetNameAsAlias={() => undefined} isLoading={false} mintedTokenId={null} {...props} />,
    {
      preloadedState: {
        nft: {
          data: preloadedNFTData || {
            'address-1': {
              data: {
                wearable: {
                  rarity: Rarity.COMMON
                }
              },
              category: NFTCategory.WEARABLE
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
  describe('and its an ENS type of asset', () => {
    beforeEach(async () => {
      useLocationMock = {
        search: '?txHash=txhash&subdomain=bondi&contractAddress=address&assetType=nft',
        pathname: '/v1/lists'
      }
      ;(useLocation as jest.Mock).mockReturnValue(useLocationMock)

      screen = renderSuccessPage(
        {
          ...props,
          isLoading: true
        },
        {
          'address-1': {
            data: {
              ens: {
                subdomain: 'bondi'
              }
            },
            category: NFTCategory.ENS
          } as NFT
        }
      )
      await waitForComponentToFinishLoading(screen)
    })

    it('should show the loading states messages asset and the asset image of the ENS', () => {
      expect(screen.getByText(t('success_page.loading_state.subdomain.title'))).toBeInTheDocument()
      expect(screen.getByText(t('success_page.loading_state.status'))).toBeInTheDocument()
    })
  })

  describe('and its another type of asset', () => {
    beforeEach(async () => {
      useLocationMock = {
        search: '?txHash=txhash&tokenId=1&contractAddress=address&assetType=nft',
        pathname: '/v1/lists'
      }
      ;(useLocation as jest.Mock).mockReturnValue(useLocationMock)
      props = { isLoading: true }
      screen = renderSuccessPage(props)
      await waitForComponentToFinishLoading(screen)
    })
    it('should render processing transaction message', () => {
      expect(screen.getByText(t('success_page.loading_state.status'))).toBeInTheDocument()
    })
  })
})

describe('when transaction finishes successfully', () => {
  beforeEach(() => {
    props = { isLoading: false }
    useLocationMock = {
      search: '?txHash=txhash&tokenId=1&contractAddress=address&assetType=nft',
      pathname: '/v1/lists'
    }
    ;(useLocation as jest.Mock).mockReturnValue(useLocationMock)
  })

  describe('and its an ENS type of asset', () => {
    describe('and the user has a profile set', () => {
      beforeEach(async () => {
        screen = renderSuccessPage(
          {
            ...props,
            profile: {} as Profile
          },
          {
            'address-1': {
              data: {
                ens: {
                  subdomain: 'bondi'
                }
              },
              category: NFTCategory.ENS
            } as NFT
          }
        )
        await waitForComponentToFinishLoading(screen)
      })
      it('should show the CTAs to mint more names, set as primary name and manage names', () => {
        expect(screen.getByText(t('success_page.success_state.mint_more_names'))).toBeInTheDocument()
        expect(screen.getByText(t('success_page.success_state.set_as_primary_name'))).toBeInTheDocument()
        expect(screen.getByText(t('success_page.success_state.manage_names'))).toBeInTheDocument()
      })
    })

    describe('and the user has not profile set yet', () => {
      beforeEach(async () => {
        screen = renderSuccessPage(
          {
            ...props,
            profile: undefined
          },
          {
            'address-1': {
              data: {
                ens: {
                  subdomain: 'bondi'
                }
              },
              category: NFTCategory.ENS
            } as NFT
          }
        )
        await waitForComponentToFinishLoading(screen)
      })
      it('should show the CTAs to mint more names only', () => {
        expect(screen.getByText(t('success_page.success_state.mint_more_names'))).toBeInTheDocument()
        expect(screen.queryByText(t('success_page.success_state.set_as_primary_name'))).not.toBeInTheDocument()
        expect(screen.queryByText(t('success_page.success_state.manage_names'))).not.toBeInTheDocument()
      })
    })
  })

  describe('and its not an ENS type of asset', () => {
    beforeEach(async () => {
      props = { isLoading: false }
      screen = renderSuccessPage(props)
      await waitForComponentToFinishLoading(screen)
    })
    it('should render transaction confirmed message', () => {
      expect(screen.getByText(t('success_page.success_state.status'))).toBeInTheDocument()
    })
  })
})
