import type { WithAuthorizedActionProps } from "decentraland-dapps/dist/containers/withAuthorizedAction"
import type { ModalProps } from "decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types"
import type { Order } from "@dcl/schemas"
import type { Route } from "decentraland-transactions/crossChain"
import type { NFT } from "../../../../modules/nft/types"
import type { Contract } from '../../../../modules/vendor/services'
import type { executeOrderRequest, executeOrderWithCardRequest } from "../../../../modules/order/actions"
import type { getContract } from '../../../../modules/contract/selectors'

export type Props = WithAuthorizedActionProps & Omit<ModalProps, 'metadata'> &  {
  metadata: { nft: NFT, order: Order, slippage?: number}
  isExecutingOrder: boolean
  isExecutingOrderCrossChain: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onExecuteOrder: typeof executeOrderRequest
  onExecuteOrderCrossChain: (route: Route) => unknown
  onExecuteOrderWithCard: typeof executeOrderWithCardRequest
}

export type MapStateProps = Pick<Props, 'getContract' | 'isExecutingOrder' | 'isExecutingOrderCrossChain'>
export type MapDispatchProps = Pick<
Props,
'onExecuteOrder' | 'onExecuteOrderCrossChain' | 'onExecuteOrderWithCard'
>
export type OwnProps = Pick<Props, 'metadata'>
