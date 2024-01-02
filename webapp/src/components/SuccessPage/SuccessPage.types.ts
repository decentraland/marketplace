import { BigNumber } from 'ethers'
import { Profile } from '@dcl/schemas'

export type Props = {
  isLoading: boolean
  mintedTokenId: BigNumber | null
  onSetNameAsAlias: (name: string) => void
  profile: Profile | undefined
}

export type MapStateProps = Pick<Props, 'isLoading' | 'mintedTokenId' | 'profile'>
export type MapDispatchProps = Pick<Props, 'onSetNameAsAlias'>
