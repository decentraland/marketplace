import { NFT } from '../../../../modules/nft/types'

export type Props = {
  nft: NFT
  onCancel: () => void
  handleSubmit: () => void
}

export type MapStateProps = Props

export type OwnProps = Pick<Props, 'nft' | 'onCancel' | 'handleSubmit'>
