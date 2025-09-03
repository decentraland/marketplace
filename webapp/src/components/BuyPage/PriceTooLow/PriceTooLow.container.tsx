import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { useGetIsBuyWithCardPageFromCurrentUrl } from '../../../modules/routing/hooks'
import PriceTooLow from './PriceTooLow'
import { PriceTooLowContainerProps } from './PriceTooLow.types'

const PriceTooLowContainer: React.FC<PriceTooLowContainerProps> = ({ chainId, network }) => {
  const dispatch = useDispatch()
  const isBuyWithCardPage = useGetIsBuyWithCardPageFromCurrentUrl()
  const handleSwitchNetwork = useCallback((chainId: number) => dispatch(switchNetworkRequest(chainId)), [dispatch])

  return <PriceTooLow chainId={chainId} network={network} isBuyWithCardPage={isBuyWithCardPage} onSwitchNetwork={handleSwitchNetwork} />
}

export default PriceTooLowContainer
