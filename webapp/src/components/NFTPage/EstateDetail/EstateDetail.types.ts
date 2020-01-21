import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT
  tokenIds: Record<string, string>
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'tokenIds'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>

export type EstateData = {
  id: string
  x: number
  y: number
  auction_price: number
  district_id: string | null
  owner: string
  auction_owner: string
  data: {
    version: number
    name: string
    description?: string
    parcels: { x: number; y: number }[]
  }
  last_transferred_at: string | null
  estate_id: string | null
  update_operator: string | null
  auction_timestamp: string
  operator: string | null
  update_managers: string[]
  approvals_for_all: string[]
}
