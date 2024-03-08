import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Network, Rarity } from '@dcl/schemas'
import { SelectedFilters } from './SelectedFilters'
import { Props } from './SelectedFilters.types'
import { getCollectionByAddress } from './utils'

jest.mock('./utils')

function renderSelectedFilters(props: Partial<Props> = {}) {
  return render(<SelectedFilters isLandSection={false} category={undefined} browseOptions={{}} onBrowse={jest.fn()} {...props} />)
}

describe('rarities filter', () => {
  test('should render rarities', () => {
    const raritiesOptions = { rarities: [Rarity.COMMON, Rarity.EPIC] }
    const { getByText } = renderSelectedFilters({
      browseOptions: raritiesOptions
    })
    expect(getByText(Rarity.COMMON)).toBeInTheDocument()
    expect(getByText(Rarity.EPIC)).toBeInTheDocument()
  })

  test('should call onBrowse without deleted rarity', async () => {
    const raritiesOptions = { rarities: [Rarity.COMMON, Rarity.EPIC] }
    const onBrowseMock = jest.fn()

    const { getByTestId } = renderSelectedFilters({
      browseOptions: raritiesOptions,
      onBrowse: onBrowseMock
    })
    const commonPill = getByTestId('pill-common')
    await userEvent.click(within(commonPill).getByRole('button'))
    expect(onBrowseMock).toHaveBeenCalledWith({ rarities: [Rarity.EPIC] })
  })
})

describe('rental days filter', () => {
  test('should render rental days', () => {
    const rentalDaysBrowseOptions = { rentalDays: [1, 30] }
    const { getByTestId } = renderSelectedFilters({
      browseOptions: rentalDaysBrowseOptions
    })
    expect(getByTestId('pill-1')).toBeInTheDocument()
    expect(getByTestId('pill-30')).toBeInTheDocument()
  })

  test('should call onBrowse without deleted rental day', async () => {
    const rentalDaysBrowseOptions = { rentalDays: [1, 30] }
    const onBrowseMock = jest.fn()

    const { getByTestId } = renderSelectedFilters({
      browseOptions: rentalDaysBrowseOptions,
      onBrowse: onBrowseMock
    })
    const commonPill = getByTestId('pill-1')
    await userEvent.click(within(commonPill).getByRole('button'))
    expect(onBrowseMock).toHaveBeenCalledWith({ rentalDays: [30] })
  })
})

describe.each([
  ['network', { network: Network.MATIC }, { network: undefined }],
  ['onlySmart', { onlySmart: true }, { onlySmart: undefined }],
  ['onlyOnSale', { onlyOnSale: false }, { onlyOnSale: true }],
  ['adjacentToRoad', { adjacentToRoad: true }, { adjacentToRoad: undefined }],
  ['price', { minPrice: '10', maxPrice: '100' }, { minPrice: undefined, maxPrice: undefined }],
  [
    'distanceToPlaza',
    { minDistanceToPlaza: '2', maxDistanceToPlaza: '10' },
    { minDistanceToPlaza: undefined, maxDistanceToPlaza: undefined }
  ],
  ['estateSize', { minEstateSize: '1', maxEstateSize: '5' }, { minEstateSize: undefined, maxEstateSize: undefined }]
])('%s filter', (id, browseOptions, resettedOptions) => {
  test(`should render ${id} filter pill`, () => {
    const { getByTestId } = renderSelectedFilters({ browseOptions })
    expect(getByTestId(`pill-${id}`)).toBeInTheDocument()
  })

  test(`should call onBrowse with ${id} filter as undefined when pill is deleted`, async () => {
    const onBrowseMock = jest.fn()
    const { getByTestId } = renderSelectedFilters({
      browseOptions,
      onBrowse: onBrowseMock
    })
    const pill = getByTestId(`pill-${id}`)
    await userEvent.click(within(pill).getByRole('button'))
    expect(onBrowseMock).toHaveBeenCalledWith(resettedOptions)
  })
})

describe('collections filter', () => {
  let contract1: string
  let contract2: string
  let collectionsData: Record<string, string>[]

  beforeEach(() => {
    contract1 = '0xanAddress'
    contract2 = '0xanotherAddress'
    collectionsData = [{ contractAddress: contract1 }, { contractAddress: contract2 }]
    ;(getCollectionByAddress as jest.Mock).mockResolvedValueOnce(collectionsData[0])
    ;(getCollectionByAddress as jest.Mock).mockResolvedValueOnce(collectionsData[1])
  })

  test.only('should render pill for each collection selected', async () => {
    const { findByTestId } = renderSelectedFilters({
      browseOptions: { contracts: [contract1, contract2] }
    })

    expect(await findByTestId(`pill-collection-${collectionsData[0].contractAddress}`)).toBeInTheDocument()
    expect(await findByTestId(`pill-collection-${collectionsData[1].contractAddress}`)).toBeInTheDocument()
  })
})
