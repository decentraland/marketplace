import { renderWithProviders } from '../../../../utils/test'
import { locations } from '../../../../modules/routing/locations'
import { AssetType } from '../../../../modules/asset/types'
import { Section } from '../../../../modules/vendor/decentraland'
import { VendorName } from '../../../../modules/vendor'
import { SortBy } from '../../../../modules/routing/types'
import CreatorsResultItemRow from './CreatorResultRow'

jest.mock('decentraland-dapps/dist/containers/Profile', () => {
  return {
    __esModule: true,
    default: () => <div>Profile</div>
  }
})

describe('CreatorsResultItemRow', () => {
  const mockCreator = {
    address: '0xabcdef123456',
    name: 'John Doe',
    collections: 1
  }

  const mockOnClick = jest.fn()

  const defaultProps = {
    creator: mockCreator,
    onClick: mockOnClick,
    'data-testid': 'creator-row-container'
  }

  test('renders without crashing', () => {
    const { getByRole } = renderWithProviders(
      <CreatorsResultItemRow {...defaultProps} />
    )
    expect(getByRole('link')).toBeInTheDocument()
  })

  test('renders creator name correctly', () => {
    const { getByText } = renderWithProviders(
      <CreatorsResultItemRow {...defaultProps} />
    )
    expect(getByText('John Doe')).toBeInTheDocument()
  })

  test('calls onClick when container is clicked', () => {
    const { getByRole } = renderWithProviders(
      <CreatorsResultItemRow {...defaultProps} />
    )
    expect(getByRole('link')).toHaveAttribute(
      'href',
      locations.account(defaultProps.creator.address, {
        assetType: AssetType.ITEM,
        section: Section.WEARABLES,
        vendor: VendorName.DECENTRALAND,
        page: 1,
        sortBy: SortBy.NEWEST
      })
    )
  })
})
