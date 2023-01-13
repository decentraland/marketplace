import { memo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import Price from '../Price'
import styles from './SaleActionBox.module.css'
import { Props } from './SaleActionBox.types'
import { isNFT } from '../../../modules/asset/utils'
import { ItemSaleActions } from './ItemSaleActions'
import { NFTSaleActions } from './NFTSaleActions'

const SaleActionBox = ({ asset }: Props) => {
  return (
    <div className={styles.main}>
      {isNFT(asset) || asset.isOnSale ? (
        <Price asset={asset} title={t('asset_page.sell_price')} />
      ) : null}
      <div className={styles.container}>
        {isNFT(asset) ? (
          <NFTSaleActions nft={asset} />
        ) : (
          <ItemSaleActions item={asset} />
        )}
      </div>
    </div>
  )
}

export default memo(SaleActionBox)
