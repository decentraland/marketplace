import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { LocationFilter, LocationFilterProps } from './LocationFilter'

function renderLocationFilter(props: Partial<LocationFilterProps> = {}) {
  return render(
    <LocationFilter
      adjacentToRoad={false}
      onAdjacentToRoadChange={jest.fn()}
      onDistanceToPlazaChange={jest.fn()}
      {...props}
    />
  )
}
describe('LocationFilter', () => {
  test('should render adjacent to road toggle', () => {
    const { getByRole } = renderLocationFilter()
    expect(
      getByRole('checkbox', { name: t('nft_filters.adjacent_to_road') })
    ).toBeInTheDocument()
  })

  test('should render near a plaza toggle', () => {
    const { getByRole } = renderLocationFilter()
    expect(
      getByRole('checkbox', { name: t('nft_filters.distance_to_plaza.title') })
    ).toBeInTheDocument()
  })

  test('should call onAdjacentToRoadChange callback when toggle changes', async () => {
    const onAdjacentToRoadChangeMock = jest.fn()
    const { getByTestId } = renderLocationFilter({
      onAdjacentToRoadChange: onAdjacentToRoadChangeMock
    })
    await userEvent.click(getByTestId('adjacent-to-road-toggle'))
    expect(onAdjacentToRoadChangeMock).toHaveBeenCalledWith(true)
  })

  test('should call oDistanceToPlazaChange callback when toggle changes', async () => {
    const onDistanceToPlazaChangeMock = jest.fn()
    const { getByTestId } = renderLocationFilter({
      onDistanceToPlazaChange: onDistanceToPlazaChangeMock
    })
    await userEvent.click(getByTestId('near-to-plaza-toggle'))
    expect(onDistanceToPlazaChangeMock).toHaveBeenCalledWith(['2', '10'])
  })

  test('should show distance slider when minDistanceToPlaza and maxDistanceToPlaza are defined', () => {
    const { getByRole } = renderLocationFilter({
      minDistanceToPlaza: '3',
      maxDistanceToPlaza: '5'
    })
    expect(getByRole('slider', { name: 'min value' })).toBeInTheDocument()
    expect(getByRole('slider', { name: 'max value' })).toBeInTheDocument()
  })
})
