import { Order } from '@dcl/schemas'

export type OrderResponse = {
  data: Order[]
  total: number
}
