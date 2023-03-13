import { RentalListingPeriod } from '@dcl/schemas'

export type Props = {
  periods: RentalListingPeriod[]
  onChange: (periodIndex: number) => unknown
  value: number | undefined
  className?: string
}
