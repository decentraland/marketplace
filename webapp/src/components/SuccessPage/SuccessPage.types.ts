import { BigNumber } from "ethers"

export type Props = {
  isLoading: boolean
  mintedTokenId: BigNumber | null
}

export type MapStateProps = Pick<Props, 'isLoading' | 'mintedTokenId'>
