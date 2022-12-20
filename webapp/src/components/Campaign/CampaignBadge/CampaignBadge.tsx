import React, { useEffect, useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import * as decentraland from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import { VendorName } from '../../../modules/vendor'
import { SortBy } from '../../../modules/routing/types'
import { AssetType } from '../../../modules/asset/types'
import IconBadge from '../../AssetPage/IconBadge'
import { Props } from './CampaignBadge.types'
import { CAMPAIGN_TAG } from '../config'

const CampaignBadge = ({ contract, isCampaignBrowserEnabled: isMVMFTabEnabled }: Props) => {
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
    ; (async () => {
      try {
        const addresses = await builderAPI.fetchAddressesByTag([CAMPAIGN_TAG])
        setContracts(addresses)
        if (isMVMFTabEnabled && addresses.includes(contract)) {
          setShowBadge(true)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [contract, isMVMFTabEnabled])

  return showBadge ? (
    <IconBadge text={t(`campaign.badge`)} icon="sparkles" href={href} />
  ) : null
}

export default React.memo(CampaignBadge)
