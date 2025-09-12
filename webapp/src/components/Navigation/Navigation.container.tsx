import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getContentfulNormalizedLocale, getTabName } from 'decentraland-dapps/dist/modules/campaign/selectors'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
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
      isFullscreen={isFullscreen}
      onOpenBuyManaWithFiatModal={handleOpenBuyManaWithFiatModal}
      onClearFilters={handleClearFilters}
    />
  )
}

export default NavigationContainer
