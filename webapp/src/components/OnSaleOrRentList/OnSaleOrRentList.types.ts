import { Props as OnSaleListElementProps } from './OnSaleListElement/OnSaleListElement.types'
import { Props as OnRentListElementProps } from './OnRentListElement/OnRentListElement.types'

export enum OnSaleOrRentType {
  RENT,
  SALE
}

export type Props = {
  elements: OnSaleListElementProps[] | OnRentListElementProps[]
  isLoading: boolean
  onSaleOrRentType: OnSaleOrRentType
}

export type MapStateProps = Pick<Props, 'elements' | 'isLoading'>

export type OwnProps = Pick<Props, 'onSaleOrRentType'>
