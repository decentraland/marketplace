import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getDistanceText } from '../../../modules/proximity/utils'
import { Highlights } from '../Highlights'
import { Props } from './ProximityHighlights.types'
import { Highlight } from '../Highlight'
import { useProximity } from '../../../modules/proximity/hooks'
import { VendorName } from '../../../modules/vendor'
import { NFT } from '../../../modules/nft/types'
import './ProximityHighlights.css'

const ProximityHighlights = (props: Props) => {
  const { nft, proximities } = props
  const proximity = useProximity(nft as NFT<VendorName.DECENTRALAND>, proximities)

  return proximity ? (
    <div className="ProximityHighlights">
      <Highlights>
        {proximity?.plaza !== undefined ? (
          <Highlight icon={<div className="plaza" />} name={t('asset_page.plaza')} description={getDistanceText(proximity?.plaza)} />
        ) : null}
        {proximity?.road !== undefined ? (
          <Highlight icon={<div className="road" />} name={t('asset_page.road')} description={getDistanceText(proximity?.road)} />
        ) : null}
        {proximity?.district !== undefined ? (
          <Highlight
            icon={<div className="district" />}
            name={t('asset_page.district')}
            description={getDistanceText(proximity?.district)}
          />
        ) : null}
      </Highlights>
    </div>
  ) : null
}

export default React.memo(ProximityHighlights)
