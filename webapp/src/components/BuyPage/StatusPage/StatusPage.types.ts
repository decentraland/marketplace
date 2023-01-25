import { RouteComponentProps } from 'react-router-dom'
import { Purchase } from 'decentraland-dapps/dist/modules/gateway/types'
import { AssetType } from '../../../modules/asset/types'

type Params = { contractAddress?: string; tokenId?: string }

export type Props = {
  type: AssetType
  purchase?: Purchase | null
}

export type MapStateProps = Pick<Props, 'purchase'>
export type OwnProps = RouteComponentProps<Params>
