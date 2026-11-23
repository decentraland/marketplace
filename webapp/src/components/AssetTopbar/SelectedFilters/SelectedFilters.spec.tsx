import { act, render, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Network, Rarity } from '@dcl/schemas'
import { SelectedFilters } from './SelectedFilters'
import { getCollectionByAddress } from './utils'
import { Props } from './SelectedFilters.types'

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

  test('should render pill for each collection selected', async () => {
    const { findByTestId } = renderSelectedFilters({
      browseOptions: { contracts: [contract1, contract2] }
    })

    expect(await findByTestId(`pill-collection-${collectionsData[0].contractAddress}`)).toBeInTheDocument()
    expect(await findByTestId(`pill-collection-${collectionsData[1].contractAddress}`)).toBeInTheDocument()
  })
})

describe('collections filter when a selected contract has no collection', () => {
  let foundContract: string
  let missingContract: string

  beforeEach(() => {
    foundContract = '0xaFoundCollection'
    missingContract = '0xaContractWithoutCollection'
    ;(getCollectionByAddress as jest.Mock).mockReset()
  })

  test('should render the pills of the collections it finds and skip the missing one', async () => {
    ;(getCollectionByAddress as jest.Mock).mockImplementation((address: string) =>
      Promise.resolve(address === foundContract ? { contractAddress: foundContract, name: 'Found collection' } : undefined)
    )

    const { findByTestId, queryByTestId } = renderSelectedFilters({
      browseOptions: { contracts: [missingContract, foundContract] }
    })

    expect(await findByTestId(`pill-collection-${foundContract}`)).toBeInTheDocument()
    expect(queryByTestId(`pill-collection-${missingContract}`)).not.toBeInTheDocument()
  })

  test('should render no collection pill when none of the contracts has a collection', async () => {
    ;(getCollectionByAddress as jest.Mock).mockResolvedValue(undefined)

    const { queryByTestId } = renderSelectedFilters({
      browseOptions: { contracts: [missingContract] }
    })

    await waitFor(() => expect(getCollectionByAddress).toHaveBeenCalledWith(missingContract))
    expect(queryByTestId(`pill-collection-${missingContract}`)).not.toBeInTheDocument()
  })

  describe('and the lookup fails', () => {
    let consoleErrorSpy: jest.SpyInstance

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
      ;(getCollectionByAddress as jest.Mock).mockRejectedValue(new Error('Network error'))
    })

    afterEach(() => {
      consoleErrorSpy.mockRestore()
    })

    test('should render no collection pill and report the error instead of rejecting', async () => {
      const { queryByTestId } = renderSelectedFilters({
        browseOptions: { contracts: [foundContract] }
      })

      await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalledWith('Could not load the selected collections', expect.any(Error)))
      expect(queryByTestId(`pill-collection-${foundContract}`)).not.toBeInTheDocument()
    })
  })

  test('should ignore the result of a lookup for contracts that are no longer selected', async () => {
    let resolveStaleLookup: (collection: Record<string, string>) => void = () => undefined
    ;(getCollectionByAddress as jest.Mock).mockImplementation((address: string) =>
      address === missingContract
        ? new Promise(resolve => {
            resolveStaleLookup = resolve
          })
        : Promise.resolve({ contractAddress: foundContract, name: 'Found collection' })
    )

    const { rerender, findByTestId, queryByTestId } = renderSelectedFilters({
      browseOptions: { contracts: [missingContract] }
    })
    rerender(
      <SelectedFilters isLandSection={false} category={undefined} browseOptions={{ contracts: [foundContract] }} onBrowse={jest.fn()} />
    )
    expect(await findByTestId(`pill-collection-${foundContract}`)).toBeInTheDocument()

    await act(async () => {
      resolveStaleLookup({ contractAddress: missingContract, name: 'Stale collection' })
      await Promise.resolve()
    })

    expect(queryByTestId(`pill-collection-${missingContract}`)).not.toBeInTheDocument()
    expect(await findByTestId(`pill-collection-${foundContract}`)).toBeInTheDocument()
  })
})
