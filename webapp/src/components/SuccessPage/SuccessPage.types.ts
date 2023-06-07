import { BigNumber } from "ethers"

export type Props = {
  isLoading: boolean
  issuedId: BigNumber | null
}

export type MapStateProps = Pick<Props, 'isLoading' | 'issuedId'>
