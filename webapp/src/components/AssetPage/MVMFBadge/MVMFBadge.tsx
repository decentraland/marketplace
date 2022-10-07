import React, { useEffect, useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import * as decentraland from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import { VendorName } from '../../../modules/vendor'
import { SortBy } from '../../../modules/routing/types'
import { AssetType } from '../../../modules/asset/types'
import IconBadge from '../IconBadge'
import { Props } from './MVMFBadge.types'

const MVMFTag = 'MVMF22'

const MVMFBadge = ({ contract, isMVMFEnabled }: Props) => {
  const [showBadge, setShowBadge] = useState(false)
  const [contracts, setContracts] = useState<string[]>()

  const href = useMemo(() => {
    return locations.MVMF22({
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
    ;(async () => {
      try {
        const addresses = await builderAPI.fetchAddressesByTag([MVMFTag])
        setContracts(addresses)
        if (isMVMFEnabled && addresses.includes(contract)) {
          setShowBadge(true)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [contract, isMVMFEnabled])

  return showBadge ? (
    <IconBadge text={t('global.mvmf_2022')} icon="sparkles" href={href} />
  ) : null
}

export default React.memo(MVMFBadge)
