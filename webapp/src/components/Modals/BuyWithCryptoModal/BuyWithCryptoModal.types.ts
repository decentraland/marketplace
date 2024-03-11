import { ChainId } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import type { CrossChainProvider, Route, Token } from 'decentraland-transactions/crossChain'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Asset } from '../../../modules/asset/types'
import { CrossChainRoute, GasCost } from './hooks'

export type MapStateProps = Pick<Props, 'wallet' | 'isBuyWithCardPage' | 'isSwitchingNetwork'>
export type MapDispatchProps = Pick<Props, 'onGetMana' | 'onSwitchNetwork'>
export type OnGetGasCost = (selectedToken: Token, nativeChainToken: Token | undefined, wallet: Wallet | null) => GasCost
export type OnGetCrossChainRoute = (
  selectedToken: Token,
  selectedChain: ChainId,
  providerTokens: Token[],
  crossChainProvider: CrossChainProvider | undefined,
  wallet: Wallet | null
) => CrossChainRoute

export type Props = Pick<WithAuthorizedActionProps, 'isLoadingAuthorization'> &
  Omit<ModalProps, 'metadata'> & {
    price: string
    wallet: Wallet | null
    metadata: { asset: Asset }
    isBuyingAsset: boolean
    isSwitchingNetwork: boolean
    isBuyWithCardPage: boolean
    onGetCrossChainRoute: OnGetCrossChainRoute
    onGetGasCost: OnGetGasCost
    onSwitchNetwork: typeof switchNetworkRequest
    onBuyNatively: () => unknown
    onGoBack?: () => unknown
    onBuyWithCard?: () => unknown
    onBuyCrossChain: (route: Route) => unknown
    onGetMana: typeof openBuyManaWithFiatModalRequest
    onClose: ModalProps['onClose']
  }

export type OwnProps = Pick<
  Props,
  'price' | 'isBuyingAsset' | 'metadata' | 'onBuyNatively' | 'onBuyWithCard' | 'onBuyCrossChain' | 'onClose' | 'onGetGasCost' | 'onGoBack'
>
