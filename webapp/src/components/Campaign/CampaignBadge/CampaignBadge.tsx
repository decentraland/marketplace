import React, { useEffect, useMemo, useState } from 'react'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { SortBy } from '../../../modules/routing/types'
import { VendorName } from '../../../modules/vendor'
import * as decentraland from '../../../modules/vendor/decentraland'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import IconBadge from '../../AssetPage/LinkedIconBadge'
import { Props } from './CampaignBadge.types'

const CampaignBadge = ({ contract, isCampaignBrowserEnabled, campaignTag }: Props) => {
  const [showBadge, setShowBadge] = useState(false)
  const [contracts, setContracts] = useState<string[]>()

  const href = useMemo(() => {
    return locations.campaign({
      section: decentraland.Section.WEARABLES,
      vendor: VendorName.DECENTRALAND,
      page: 1,
      sortBy: SortBy.RECENTLY_LISTED,
      onlyOnSale: true,
      assetType: AssetType.ITEM,
      contracts
    })
  }, [contracts])

  useEffect(() => {
    void (async () => {
      try {
        if (isCampaignBrowserEnabled && campaignTag) {
          const addresses = await builderAPI.fetchAddressesByTag([campaignTag])
          setContracts(addresses)
          setShowBadge(addresses.includes(contract))
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [contract, isCampaignBrowserEnabled, campaignTag])

  return showBadge && campaignTag ? <IconBadge text={campaignTag} icon="sparkles" href={href} /> : null
}

export default React.memo(CampaignBadge)
