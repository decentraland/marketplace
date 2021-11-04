import { Props as OnSaleListElementProps } from './OnSaleListElement/OnSaleListElement.types'

export type Props = {
  elements: OnSaleListElementProps[]
  isLoading: boolean
}

export type MapStateProps = Pick<Props, 'elements' | 'isLoading'>
