import { Item } from '@dcl/schemas'

export type Props = {
  contractAddress: string
  items: Item[]
  isLoading: boolean
}

export type MapStateProps = Pick<Props, 'items' | 'isLoading'>
export type OwnProps = Pick<Props, 'contractAddress'>
