import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'

export type Props = {
  tx: Transaction
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
}

export type MapStateProps = Pick<Props, 'getContract'>
