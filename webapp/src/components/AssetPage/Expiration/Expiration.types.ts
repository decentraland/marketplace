import { Order } from '@dcl/schemas'

export type Props = {
  order?: Order
}

export type MapStateProps = Pick<Props, 'order'>
