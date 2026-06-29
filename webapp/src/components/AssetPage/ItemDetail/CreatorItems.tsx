import React from 'react'
import { Link } from 'react-router-dom'
import { Item, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from 'decentraland-ui'
import { formatWeiMANA } from '../../../lib/mana'
import { getAssetImage, getAssetName, getAssetUrl } from '../../../modules/asset/utils'
import styles from './CreatorItems.module.css'

type Props = {
  items: Item[]
  isLoading: boolean
  currentContractAddress: string
}

// "Other Collections from the creator": a row of the creator's other on-sale
// items (excluding the current collection).
const CreatorItems = ({ items, isLoading, currentContractAddress }: Props) => {
  const others = items.filter(item => item.contractAddress !== currentContractAddress).slice(0, 10)

  if (!isLoading && others.length === 0) return null

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>{t('creator_items.title')}</h2>
      <div className={styles.row}>
        {others.map(item => (
          <Link key={item.id} to={getAssetUrl(item)} className={styles.card}>
            <div className={styles.image}>
              <img src={getAssetImage(item)} alt={getAssetName(item)} loading="lazy" />
            </div>
            <div className={styles.body}>
              <span className={styles.name}>{getAssetName(item)}</span>
              {item.isOnSale && item.price && item.price !== '0' ? (
                <span className={styles.price}>
                  <Mana network={item.network ?? Network.MATIC} inline>
                    {formatWeiMANA(item.price)}
                  </Mana>
                </span>
              ) : (
                <span className={styles.notForSale}>{t('creator_items.not_for_sale')}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default React.memo(CreatorItems)
