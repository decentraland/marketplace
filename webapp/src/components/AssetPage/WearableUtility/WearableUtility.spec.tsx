import { t } from 'decentraland-dapps/dist/modules/translation'
import { renderWithProviders } from '../../../utils/test'
import { WEARABLE_UTILITY_CONTENT_DATA_TEST_ID, WEARABLE_UTILITY_HEADER_DATA_TEST_ID, WearableUtility } from './WearableUtility'
import { Props } from './WearableUtility.types'

const renderWearableUtility = (props: Partial<Props>) => renderWithProviders(<WearableUtility utility="someUtility" {...props} />)

describe('when rendering the wearable utility component', () => {
  let renderedComponent: ReturnType<typeof renderWearableUtility>
  let utility: string

  beforeEach(() => {
    utility = 'This is some utility!'
    renderedComponent = renderWearableUtility({ utility })
  })

  it('should render the utility header and the wearable utility', () => {
    const { getByTestId } = renderedComponent
    expect(getByTestId(WEARABLE_UTILITY_HEADER_DATA_TEST_ID).textContent).toEqual(t('global.utility'))
    expect(getByTestId(WEARABLE_UTILITY_CONTENT_DATA_TEST_ID).textContent).toEqual(utility)
  })
})
