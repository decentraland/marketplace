import { screen, fireEvent } from '@testing-library/react'
import { BuilderCollectionAttributes } from '../../../../modules/vendor/decentraland/builder/types'
import { renderWithProviders } from '../../../../utils/test'
import CollectionResultRow from './CollectionResultRow'

describe('CollectionResultRow', () => {
  const mockCollection = {
    contract_address: '0x1234567890',
    name: 'My Collection',
    eth_address: '0xabcdef123456'
  } as BuilderCollectionAttributes

  const mockOnClick = jest.fn()

  const defaultProps = {
    collection: mockCollection,
    onClick: mockOnClick,
    'data-testid': 'collection-row-container'
  }

  test('renders without crashing', () => {
    const { getByTestId } = renderWithProviders(
      <CollectionResultRow {...defaultProps} />
    )
    expect(getByTestId(defaultProps['data-testid'])).toBeInTheDocument()
  })

  test('renders collection name correctly', () => {
    const { getByText } = renderWithProviders(
      <CollectionResultRow {...defaultProps} />
    )
    expect(getByText('My Collection')).toBeInTheDocument()
  })

  test('renders creator profile correctly', () => {
    const { getByText } = renderWithProviders(
      <CollectionResultRow {...defaultProps} />
    )
    expect(
      getByText(mockCollection.eth_address.slice(0, 6))
    ).toBeInTheDocument() // shows only the first 6 characters
  })

  test('calls onClick when container is clicked', () => {
    renderWithProviders(<CollectionResultRow {...defaultProps} />)
    fireEvent.click(screen.getByTestId('collection-row-container'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
