import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { isSwitchingNetwork as getIsSwitchingNetwork } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { claimNameWithCreditsClearProgress } from '../../../modules/ens/actions'
import { getCreditsClaimProgress } from '../../../modules/ens/selectors'
import { useGetIsBuyWithCardPageFromCurrentUrl } from '../../../modules/routing/hooks'
import { getWallet } from '../../../modules/wallet/selectors'
import { BuyWithCryptoModal } from './BuyWithCryptoModal'
import { ContainerProps } from './BuyWithCryptoModal.types'

const BuyWithCryptoModalContainer: React.FC<ContainerProps> = props => {
  const dispatch = useDispatch()
  const isBuyWithCardPage = useGetIsBuyWithCardPageFromCurrentUrl()
  const wallet = useSelector(getWallet)
  const isSwitchingNetwork = useSelector(getIsSwitchingNetwork)
  const credits = useSelector(state => getCredits(state, wallet?.address || '') as CreditsResponse | null)
  const creditsClaimProgress = useSelector(getCreditsClaimProgress)

  const handleGetMana: ActionFunction<typeof openBuyManaWithFiatModalRequest> = useCallback(
    () => dispatch(openBuyManaWithFiatModalRequest(props.metadata?.asset?.network)),
    [dispatch, props.metadata?.asset?.network]
  )
  const handleSwitchNetwork: ActionFunction<typeof switchNetworkRequest> = useCallback(
    chainId => dispatch(switchNetworkRequest(chainId)),
    [dispatch]
  )
  const handleClearCreditsClaimProgress = useCallback(() => dispatch(claimNameWithCreditsClearProgress()), [dispatch])

  return (
    <BuyWithCryptoModal
      wallet={wallet}
      isSwitchingNetwork={isSwitchingNetwork}
      isBuyWithCardPage={isBuyWithCardPage}
      credits={credits}
      creditsClaimProgress={creditsClaimProgress}
      onGetMana={handleGetMana}
      onSwitchNetwork={handleSwitchNetwork}
      onClearCreditsClaimProgress={handleClearCreditsClaimProgress}
      {...props}
    />
  )
}

export default BuyWithCryptoModalContainer
