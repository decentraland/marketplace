import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PeriodOption } from '../../../modules/rental/types'
import {
  RentalPeriodFilter,
  RentalPeriodFilterProps
} from './RentalPeriodFilter'

function renderRentalPeriodFilter(
  props: Partial<RentalPeriodFilterProps> = {}
) {
  return render(
    <RentalPeriodFilter rentalDays={[]} onChange={jest.fn()} {...props} />
  )
}
describe('RentalPeriodFilter', () => {
  it.each(Object.values(PeriodOption))(
    'should render all rental days option for %s',
    option => {
      const { getByTestId } = renderRentalPeriodFilter()
      expect(getByTestId(option)).toBeInTheDocument()
    }
  )

  describe("when checkbox clicked", () => {
    it('should call onChange with the correct value', async () => {
      const onChangeMock = jest.fn()
      const { getByTestId } = renderRentalPeriodFilter({
        onChange: onChangeMock
      })
      await userEvent.click(getByTestId(PeriodOption.ONE_DAY))
      expect(onChangeMock).toHaveBeenCalledWith([1])
    })
  })
})
