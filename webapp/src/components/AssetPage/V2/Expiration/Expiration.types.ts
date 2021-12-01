import { Order } from '../../../../modules/order/types'

export type Props = {
  order?: Order
}

export type MapStateProps = Pick<Props, 'order'>
