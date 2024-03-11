import { Dispatch } from 'redux'
import {
  FetchAuthorizationsRequestAction,
  RevokeTokenRequestAction,
  fetchAuthorizationsRequest,
  revokeTokenRequest
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Props as OnSaleListElementProps } from './OnSaleListElement/OnSaleListElement.types'
import { Props as OnRentListElementProps } from './OnRentListElement/OnRentListElement.types'

export enum OnSaleOrRentType {
  RENT,
  SALE
}

export type Props = {
  elements: OnSaleListElementProps[] | OnRentListElementProps[]
  wallet: Wallet | null
  address?: string
  isCurrentAccount: boolean
  isLoading: boolean
  onSaleOrRentType: OnSaleOrRentType
  onFetchAuthorizations: typeof fetchAuthorizationsRequest
  onRevoke: typeof revokeTokenRequest
}

export type MapStateProps = Pick<Props, 'elements' | 'isLoading' | 'wallet'>

export type OwnProps = Pick<Props, 'onSaleOrRentType' | 'address' | 'isCurrentAccount'>

export function isOnSaleListElementProps(element: OnSaleListElementProps | OnRentListElementProps): element is OnSaleListElementProps {
  return 'order' in element
}

export type MapDispatchProps = Pick<Props, 'onFetchAuthorizations' | 'onRevoke'>

export type MapDispatch = Dispatch<FetchAuthorizationsRequestAction | RevokeTokenRequestAction>
