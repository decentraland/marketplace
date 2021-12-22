import { Sale } from '@dcl/schemas'

export type Props = {
  sales: Sale[]
}

export type MapStateProps = Pick<Props, 'sales'>
