import type { ChainId, Order } from '@dcl/schemas'
import type { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import type { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import type { Route } from 'decentraland-transactions/crossChain'
import type { getContract } from '../../../../modules/contract/selectors'
import type { NFT } from '../../../../modules/nft/types'
import type { executeOrderRequest, executeOrderWithCardRequest } from '../../../../modules/order/actions'
import type { Contract } from '../../../../modules/vendor/services'

export type Props = WithAuthorizedActionProps &
  Omit<ModalProps, 'metadata'> & {
    metadata: { nft: NFT; order: Order; slippage?: number; useCredits?: boolean }
    connectedChainId: ChainId | undefined
    isExecutingOrder: boolean
    isExecutingOrderCrossChain: boolean
    credits: CreditsResponse | null
    getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
    onExecuteOrder: typeof executeOrderRequest
    onExecuteOrderCrossChain: (route: Route) => unknown
    onExecuteOrderWithCard: typeof executeOrderWithCardRequest
  }

export type MapStateProps = Pick<Props, 'getContract' | 'isExecutingOrder' | 'isExecutingOrderCrossChain' | 'connectedChainId' | 'credits'>
export type MapDispatchProps = Pick<Props, 'onExecuteOrder' | 'onExecuteOrderCrossChain' | 'onExecuteOrderWithCard'>
export type OwnProps = Pick<Props, 'metadata'>
