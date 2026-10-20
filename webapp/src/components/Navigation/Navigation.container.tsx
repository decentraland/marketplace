import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getContentfulNormalizedLocale, getTabName } from 'decentraland-dapps/dist/modules/campaign/selectors'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { isConnected } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { getIsCampaignBrowserEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { clearFilters } from '../../modules/routing/actions'
import { useGetBrowseOptions } from '../../modules/routing/hooks'
import Navigation from './Navigation'
import { ContainerProps } from './Navigation.types'

const NavigationContainer: React.FC<ContainerProps> = ({ activeTab }) => {
  const dispatch = useDispatch()
  const { isFullscreen } = useGetBrowseOptions()
  const campaignTab = useSelector((state: RootState) => getTabName(state)?.[getContentfulNormalizedLocale(state)])
  const isCampaignBrowserEnabled = useSelector(getIsCampaignBrowserEnabled)
  const connected = useSelector(isConnected)

  const handleOpenBuyManaWithFiatModal = useCallback<ActionFunction<typeof openBuyManaWithFiatModalRequest>>(
    () => dispatch(openBuyManaWithFiatModalRequest()),
    [dispatch]
  )
  const handleClearFilters = useCallback<ActionFunction<typeof clearFilters>>(() => dispatch(clearFilters()), [dispatch])

  return (
    <Navigation
      activeTab={activeTab}
      campaignTab={campaignTab}
      isCampaignBrowserEnabled={isCampaignBrowserEnabled}
      isConnected={connected}
      isFullscreen={isFullscreen}
      onOpenBuyManaWithFiatModal={handleOpenBuyManaWithFiatModal}
      onClearFilters={handleClearFilters}
    />
  )
}

export default NavigationContainer
