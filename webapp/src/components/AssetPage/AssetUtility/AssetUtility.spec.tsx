import { t } from 'decentraland-dapps/dist/modules/translation'
import { renderWithProviders } from '../../../utils/test'
import { ASSET_UTILITY_CONTENT_DATA_TEST_ID, ASSET_UTILITY_HEADER_DATA_TEST_ID, AssetUtility } from './AssetUtility'
import { Props } from './AssetUtility.types'

const renderWearableUtility = (props: Partial<Props>) => renderWithProviders(<AssetUtility utility="someUtility" {...props} />)

describe('when rendering the wearable utility component', () => {
  let renderedComponent: ReturnType<typeof renderWearableUtility>
  let utility: string

  beforeEach(() => {
    utility = 'This is some utility!'
    renderedComponent = renderWearableUtility({ utility })
  })

  it('should render the utility header and the wearable utility', () => {
    const { getByTestId } = renderedComponent
    expect(getByTestId(ASSET_UTILITY_HEADER_DATA_TEST_ID).textContent).toEqual(t('global.utility'))
    expect(getByTestId(ASSET_UTILITY_CONTENT_DATA_TEST_ID).textContent).toEqual(utility)
  })
})
