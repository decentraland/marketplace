import { ChainId, Item } from '@dcl/schemas'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import type { Route } from 'decentraland-transactions/crossChain'
import { getContract } from '../../../../modules/contract/selectors'
import { getCredits } from '../../../../modules/credits/selectors'
import { buyItemRequest, buyItemWithCardRequest } from '../../../../modules/item/actions'
import { Contract } from '../../../../modules/vendor/services'

export type Props = WithAuthorizedActionProps &
  Omit<ModalProps, 'metadata'> & {
    credits: ReturnType<typeof getCredits> | null
    connectedChainId: ChainId | undefined
    metadata: { item: Item; useCredits: boolean }
    isBuyingItemNatively: boolean
    isBuyingItemCrossChain: boolean
    getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
    onBuyItem: typeof buyItemRequest
    onBuyItemCrossChain: (route: Route) => unknown
    onBuyWithCard: typeof buyItemWithCardRequest
  }

export type MapStateProps = Pick<Props, 'getContract' | 'isBuyingItemNatively' | 'isBuyingItemCrossChain' | 'connectedChainId' | 'credits'>
export type MapDispatchProps = Pick<Props, 'onBuyItem' | 'onBuyItemCrossChain' | 'onBuyWithCard'>
export type OwnProps = Pick<Props, 'metadata'>
