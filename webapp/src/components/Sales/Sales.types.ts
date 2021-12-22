import { Sale, SaleFilters } from '@dcl/schemas'

export type Props = {
  address: string
  sales: Sale[]
  onFetchSales: (filters: SaleFilters) => void
}

export type MapStateProps = Pick<Props, 'address' | 'sales'>
export type MapDispatchProps = Pick<Props, 'onFetchSales'>
