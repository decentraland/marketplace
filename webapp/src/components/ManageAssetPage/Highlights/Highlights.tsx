import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { useProximity } from '../../../modules/proximity/hooks'
import { Proximity } from '../../../modules/proximity/types'
import { getDistanceText } from '../../../modules/proximity/utils'
import { InfoTooltip } from '../../InfoTooltip'
import { Box } from '../../AssetBrowse/Box'
import { Props } from './Highlights.types'
import styles from './Highlights.module.css'

export const Highlights = (props: Props) => {
  const { nft, proximities, className } = props
  const proximity = useProximity(nft, proximities)

  const proximityTitle = {
    plaza: t('manage_asset_page.highlights.plaza'),
    road: t('manage_asset_page.highlights.road'),
    district: t('manage_asset_page.highlights.district')
  }

  const highlightTypes =
    proximity && (Object.keys(proximity) as (keyof Proximity)[])

  return highlightTypes ? (
    <Box
      header={t('manage_asset_page.highlights.title')}
      className={classNames(className)}
    >
      {highlightTypes.map((highlightType, index) => (
        <div key={index} className={styles.highlight}>
          <div className={classNames(styles[highlightType], styles.icon)}></div>
          <div className={styles.title}>
            {proximityTitle[highlightType]}
            {proximity && proximity[highlightType] !== undefined && (
              <InfoTooltip
                content={getDistanceText(proximity[highlightType]!)}
              />
            )}
          </div>
        </div>
      ))}
    </Box>
  ) : null
}
