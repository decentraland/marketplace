import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAdditionalTags, getMainTag } from 'decentraland-dapps/dist/modules/campaign/selectors'
import { fetchEventRequest } from '../../../modules/event/actions'
import { getData as getContracts, isFetchingEvent } from '../../../modules/event/selectors'
import { getIsCampaignBrowserEnabled } from '../../../modules/features/selectors'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import CampaignBrowserPage from './CampaignBrowserPage'

export const CampaignBrowserPageContainer: React.FC = () => {
  const dispatch = useDispatch()
  const { vendor, assetType, section, isFullscreen } = useGetBrowseOptions()
  const contracts = useSelector(getContracts)
  const campaignTag = useSelector(getMainTag)
  const isCampaignBrowserEnabled = useSelector(getIsCampaignBrowserEnabled)
  const additionalCampaignTags = useSelector(getAdditionalTags)
  const isFetchingEventState = useSelector(isFetchingEvent)

  const handleOnFetchEventContracts: ActionFunction<typeof fetchEventRequest> = useCallback(
    (eventTag, additionalSearchTags = []) => dispatch(fetchEventRequest(eventTag, additionalSearchTags)),
    [dispatch]
  )

  return (
    <CampaignBrowserPage
      vendor={vendor}
      assetType={assetType}
      section={section}
      isFullscreen={isFullscreen}
      contracts={contracts}
      campaignTag={campaignTag}
      isCampaignBrowserEnabled={isCampaignBrowserEnabled}
      additionalCampaignTags={additionalCampaignTags}
      isFetchingEvent={isFetchingEventState}
      onFetchEventContracts={handleOnFetchEventContracts}
    />
  )
}

export default CampaignBrowserPageContainer
