import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getDistanceText } from '../../../modules/proximity/utils'
import { Highlights } from '../Highlights'
import { Props } from './ProximityHighlights.types'
import { Highlight } from '../Highlight'
import './ProximityHighlights.css'
import { useProximity } from '../../../modules/proximity/hooks'

const ProximityHighlights = (props: Props) => {
  const { nft, proximities } = props
  const proximity = useProximity(nft, proximities)

  return (
    <div className="ProximityHighlights">
      {proximity ? (
        <Highlights>
          {proximity?.plaza !== undefined ? (
            <Highlight
              icon={<div className="plaza" />}
              name={t('detail.plaza')}
              description={getDistanceText(proximity?.plaza)}
            />
          ) : null}
          {proximity?.road !== undefined ? (
            <Highlight
              icon={<div className="road" />}
              name={t('detail.road')}
              description={getDistanceText(proximity?.road)}
            />
          ) : null}
          {proximity?.district !== undefined ? (
            <Highlight
              icon={<div className="district" />}
              name={t('detail.district')}
              description={getDistanceText(proximity?.district)}
            />
          ) : null}
        </Highlights>
      ) : null}
    </div>
  )
}

export default React.memo(ProximityHighlights)
