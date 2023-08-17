import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../../modules/asset/types'
import { View } from '../../../modules/ui/types'
import { isAccountView } from '../../../modules/ui/utils'
import { ToggleBox } from '../../AssetBrowse/ToggleBox'
import styles from './AssetTypeFilter.module.css'

type AssetTypeFilterProps = {
  view: View | undefined
  assetType: AssetType
  onChange: (assetType: AssetType) => void
}

export const AssetTypeFilter = ({ view, assetType, onChange }: AssetTypeFilterProps) => {
  const toggleBoxI18nKey = view && isAccountView(view) ? 'account_page' : 'browse_page'
  return (
    <ToggleBox
      direction="row"
      className={styles.toggleFlex}
      items={[
        {
          title: t(`${toggleBoxI18nKey}.primary_market_title`),
          active: assetType === AssetType.ITEM,
          description: t(`${toggleBoxI18nKey}.primary_market_subtitle`),
          onClick: () => (assetType !== AssetType.ITEM ? onChange(AssetType.ITEM) : undefined),
          icon: <div className={styles.marketIcon} />
        },
        {
          title: t(`${toggleBoxI18nKey}.secondary_market_title`),
          active: assetType === AssetType.NFT,
          description: t(`${toggleBoxI18nKey}.secondary_market_subtitle`),
          onClick: () => (assetType !== AssetType.NFT ? onChange(AssetType.NFT) : undefined),
          icon: <div className={styles.listingsIcon} />
        }
      ]}
    />
  )
}
