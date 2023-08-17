import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { getContract } from '../../../modules/contract/selectors'
import { Contract } from '../../../modules/vendor/services'

export type Props = {
  tx: Transaction
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
}

export type MapStateProps = Pick<Props, 'getContract'>
