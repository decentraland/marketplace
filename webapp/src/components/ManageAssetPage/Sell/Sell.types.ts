import { Order } from '@dcl/schemas'

export type Props = {
  className?: string
  order?: Order | null
  onListForSale: () => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onListForSale'>
