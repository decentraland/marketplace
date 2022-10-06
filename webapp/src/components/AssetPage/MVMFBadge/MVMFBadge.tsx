import React, { useEffect, useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import IconBadge from '../IconBadge'
import { Props } from './MVMFBadge.types'

const MVMFTag = 'MVMF22'

const MVMFBadge = ({ contractAddress, isMVMFEnabled }: Props) => {
  const [showBadge, setShowBadge] = useState(false)
  const [contracts, setContracts] = useState<string[]>()

  const href = useMemo(() => {
    return locations.browse({
      contracts
    })
  }, [contracts])

  useEffect(() => {
    ;(async () => {
      const { addresses } = await builderAPI.fetchAddressesByTag([MVMFTag])
      setContracts(addresses)
      if (isMVMFEnabled && addresses.includes(contractAddress)) {
        setShowBadge(true)
      }
    })()
  }, [contractAddress, isMVMFEnabled])

  return showBadge ? (
    <IconBadge text={t('global.mvmf_2022')} icon="sparkles" href={href} />
  ) : null
}

export default React.memo(MVMFBadge)
