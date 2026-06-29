import React, { useMemo } from 'react'
import { BigNumber } from 'ethers'
import { Item, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Mana } from 'decentraland-ui'
import { formatWeiMANA } from '../../../lib/mana'
import { getAssetImage } from '../../../modules/asset/utils'
import { useCart } from '../../Cart'
import styles from './CollectionBundle.module.css'

type Props = {
  contractAddress: string
  items: Item[]
  currentItem: Item
}

// Demo: buy the whole collection at a fixed bundle price (sum of the on-sale
// items minus a flat discount). Adds a single "bundle" entry to the demo cart.
const BUNDLE_DISCOUNT = 15

const CollectionBundle = ({ contractAddress, items, currentItem }: Props) => {
  const { addItem, isInCart } = useCart()

  const sellable = useMemo(() => items.filter(item => item.isOnSale && item.price && item.price !== '0'), [items])

  const { totalWei, bundleWei } = useMemo(() => {
    const total = sellable.reduce((acc, item) => acc.add(BigNumber.from(item.price)), BigNumber.from(0))
    return {
      totalWei: total.toString(),
      bundleWei: total
        .mul(100 - BUNDLE_DISCOUNT)
        .div(100)
        .toString()
    }
  }, [sellable])

  // A bundle only makes sense with at least two purchasable items.
  if (sellable.length < 2) return null

  const network = sellable[0].network ?? Network.MATIC
  const cartId = `bundle-${contractAddress}`
  const inCart = isInCart(cartId)

  const handleAddBundle = () => {
    addItem({
      id: cartId,
      name: t('collection_bundle.cart_name', { count: sellable.length }),
      thumbnail: getAssetImage(currentItem),
      price: bundleWei,
      network
    })
  }

  return (
    <div className={styles.bundle}>
      <div className={styles.left}>
        <div className={styles.thumbs}>
          {sellable.slice(0, 6).map(item => (
            <img key={item.id} src={getAssetImage(item)} alt={item.name} className={styles.thumb} loading="lazy" />
          ))}
        </div>
        <div className={styles.info}>
          <span className={styles.title}>{t('collection_bundle.title')}</span>
          <span className={styles.subtitle}>{t('collection_bundle.subtitle', { count: sellable.length })}</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.prices}>
          <span className={styles.original}>
            <Mana network={network} inline>
              {formatWeiMANA(totalWei)}
            </Mana>
          </span>
          <span className={styles.bundlePrice}>
            <Mana network={network} inline>
              {formatWeiMANA(bundleWei)}
            </Mana>
          </span>
          <span className={styles.save}>{t('collection_bundle.save', { percent: BUNDLE_DISCOUNT })}</span>
        </div>
        <Button className={styles.buyBundle} onClick={handleAddBundle} disabled={inCart} primary>
          {inCart ? t('collection_bundle.added') : t('collection_bundle.buy')}
        </Button>
      </div>
    </div>
  )
}

export default React.memo(CollectionBundle)
