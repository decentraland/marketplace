import { BigNumber } from 'ethers'

export type Props = {
  isLoading: boolean
  mintedTokenId: BigNumber | null
  onSetNameAsAlias: (name: string) => void
}

export type MapStateProps = Pick<Props, 'isLoading' | 'mintedTokenId'>
export type MapDispatchProps = Pick<Props, 'onSetNameAsAlias'>
