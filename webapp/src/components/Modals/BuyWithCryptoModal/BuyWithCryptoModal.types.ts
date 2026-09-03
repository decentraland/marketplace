import { ChainId } from '@dcl/schemas'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import type { CrossChainProvider, Route, Token } from 'decentraland-transactions/crossChain'
import { Asset } from '../../../modules/asset/types'
import { CreditsClaimProgress } from '../../../modules/ens/types'
import { CrossChainRoute, GasCost } from './hooks'

export type MapStateProps = Pick<Props, 'wallet' | 'isBuyWithCardPage' | 'isSwitchingNetwork' | 'credits' | 'creditsClaimProgress'>
export type MapDispatchProps = Pick<Props, 'onGetMana' | 'onSwitchNetwork' | 'onClearCreditsClaimProgress' | 'onRouteError'>
export type OnGetGasCost = (selectedToken: Token, nativeChainToken: Token | undefined, wallet: Wallet | null) => GasCost
export type OnGetCrossChainRoute = (
  selectedToken: Token,
  selectedChain: ChainId,
  providerTokens: Token[],
  crossChainProvider: CrossChainProvider | undefined,
  wallet: Wallet | null,
  withCredits?: boolean
) => CrossChainRoute

export type Props = Pick<WithAuthorizedActionProps, 'isLoadingAuthorization' | 'isUsingMagic'> &
  Omit<ModalProps, 'metadata'> & {
    price: string
    credits: CreditsResponse | null
    useCredits?: boolean
    wallet: Wallet | null
    metadata: { asset: Asset }
    isBuyingAsset: boolean
    isSwitchingNetwork: boolean
    isBuyWithCardPage: boolean
    creditsClaimProgress: CreditsClaimProgress | null
    onGetCrossChainRoute: OnGetCrossChainRoute
    onGetGasCost: OnGetGasCost
    onSwitchNetwork: ActionFunction<typeof switchNetworkRequest>
    onBuyNatively: () => unknown
    onGoBack?: () => unknown
    onBuyWithCard?: () => unknown
    onBuyCrossChain: (route: Route) => unknown
    onGetMana: ActionFunction<typeof openBuyManaWithFiatModalRequest>
    onBuyWithCredits?: (manaToSpendByUser: bigint) => unknown
    onClearCreditsClaimProgress?: () => void
    onRouteError?: () => void
    onClose: ModalProps['onClose']
  }

export type ContainerProps = Pick<
  Props,
  | 'metadata'
  | 'price'
  | 'useCredits'
  | 'isBuyingAsset'
  | 'onBuyNatively'
  | 'onBuyWithCard'
  | 'onBuyCrossChain'
  | 'onBuyWithCredits'
  | 'onClose'
  | 'onGetGasCost'
  | 'isUsingMagic'
  | 'isLoadingAuthorization'
  | 'onGetCrossChainRoute'
  | 'onGoBack'
  | 'name'
>
