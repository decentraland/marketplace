import { ContentfulLocale } from '@dcl/schemas'
import { RootState } from '../../modules/reducer'
import { renderWithProviders } from '../../utils/test'
import CampaignBanner from './CampaignBanner'

// ui2's <Banner> paints the artwork and is exercised in ui2's own suite; here it only gets in the way,
// because its module does not resolve under the jest transform. What this spec is about is the wrapper.
jest.mock('decentraland-dapps/dist/containers/Banner', () => ({ Banner: () => null }))

const BANNER_ID = 'marketplaceCampaignCollectiblesBanner'
const ARTWORK_ID = 'an-artwork'

const campaignWithArtworkOfWidth = (width: number) =>
  ({
    campaign: {
      data: {
        banners: {
          [BANNER_ID]: {
            id: BANNER_ID,
            fullSizeBackground: { [ContentfulLocale.enUS]: { sys: { type: 'Link', linkType: 'Asset', id: ARTWORK_ID } } }
          }
        },
        assets: {
          [ARTWORK_ID]: {
            sys: { id: ARTWORK_ID },
            fields: {
              file: {
                [ContentfulLocale.enUS]: {
                  url: '//images.example.com/artwork.jpg',
                  fileName: 'artwork.jpg',
                  contentType: 'image/jpeg',
                  details: { size: 1, image: { width, height: 300 } }
                }
              }
            }
          }
        }
      },
      loading: [],
      error: null
    }
  }) as unknown as Partial<RootState>

const renderBanner = (preloadedState?: Partial<RootState>) =>
  renderWithProviders(<CampaignBanner id={BANNER_ID} />, { preloadedState }).container.querySelector('.CampaignBanner')

describe('when the artwork is narrower than a desktop window', () => {
  it('should frame it, so it is drawn near its native size instead of stretched across the banner', () => {
    expect(renderBanner(campaignWithArtworkOfWidth(1280))).toHaveClass('framed')
  })
})

describe('when the artwork is as wide as a desktop window', () => {
  it('should not frame it, so it fills the banner on its own', () => {
    expect(renderBanner(campaignWithArtworkOfWidth(1920))).not.toHaveClass('framed')
  })
})

describe('when the campaign has not loaded yet', () => {
  it('should frame the banner, which is the treatment that never stretches artwork it has not measured', () => {
    expect(renderBanner()).toHaveClass('framed')
  })
})
