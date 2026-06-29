import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { CatalogSortBy, Item, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Mana } from 'decentraland-ui'
import { formatWeiMANA } from '../../../lib/mana'
import { getAssetImage, getAssetName } from '../../../modules/asset/utils'
import { catalogAPI } from '../../../modules/vendor/decentraland/catalog/api'
import { useCart } from '../../Cart'
import styles from './HomeBundles.module.css'

// Demo: a few "buy the whole collection" bundles on the Overview page. We group
// on-sale catalog items by collection and surface the ones with several items,
// priced at a flat discount over the sum (client-side, no real checkout).
const DISCOUNT = 15
const MAX_BUNDLES = 4
const MIN_ITEMS = 3

type Bundle = {
  contractAddress: string
  items: Item[]
  totalWei: string
  bundleWei: string
  network: Network
}

const HomeBundles = () => {
  const { addItem, isInCart } = useCart()
  const [bundles, setBundles] = useState<Bundle[]>([])

  useEffect(() => {
    let cancelled = false
    catalogAPI
      .get({ isOnSale: true, first: 200, sortBy: CatalogSortBy.MOST_EXPENSIVE })
      .then(res => {
        const byContract = new Map<string, Item[]>()
        for (const item of res.data) {
          if (!item.price || item.price === '0') continue
          const arr = byContract.get(item.contractAddress) || []
          arr.push(item)
          byContract.set(item.contractAddress, arr)
        }
        const built = [...byContract.values()]
          .filter(items => items.length >= MIN_ITEMS)
          .sort((a, b) => b.length - a.length)
          .slice(0, MAX_BUNDLES)
          .map(items => {
            const total = items.reduce((acc, item) => acc.add(BigNumber.from(item.price)), BigNumber.from(0))
            return {
              contractAddress: items[0].contractAddress,
              items,
              totalWei: total.toString(),
              bundleWei: total
                .mul(100 - DISCOUNT)
                .div(100)
                .toString(),
              network: items[0].network ?? Network.MATIC
            }
          })
        if (!cancelled) setBundles(built)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  if (bundles.length === 0) return null

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>{t('home_bundles.title')}</h2>
      <p className={styles.subtitle}>{t('home_bundles.subtitle')}</p>
      <div className={styles.grid}>
        {bundles.map(bundle => {
          const cartId = `bundle-${bundle.contractAddress}`
          const inCart = isInCart(cartId)
          const name = getAssetName(bundle.items[0])
          return (
            <div key={bundle.contractAddress} className={styles.card}>
              <div className={styles.thumbs}>
                {bundle.items.slice(0, 4).map(item => (
                  <img key={item.id} src={getAssetImage(item)} alt={item.name} className={styles.thumb} loading="lazy" />
                ))}
              </div>
              <div className={styles.body}>
                <span className={styles.name}>{name}</span>
                <span className={styles.count}>{t('home_bundles.count', { count: bundle.items.length })}</span>
                <div className={styles.prices}>
                  <span className={styles.original}>
                    <Mana network={bundle.network} inline>
                      {formatWeiMANA(bundle.totalWei)}
                    </Mana>
                  </span>
                  <span className={styles.bundlePrice}>
                    <Mana network={bundle.network} inline>
                      {formatWeiMANA(bundle.bundleWei)}
                    </Mana>
                  </span>
                  <span className={styles.save}>{t('collection_bundle.save', { percent: DISCOUNT })}</span>
                </div>
                <Button
                  className={styles.buy}
                  primary
                  fluid
                  disabled={inCart}
                  onClick={() =>
                    addItem({
                      id: cartId,
                      name: `${name} ${t('home_bundles.bundle_suffix')}`,
                      thumbnail: getAssetImage(bundle.items[0]),
                      price: bundle.bundleWei,
                      network: bundle.network
                    })
                  }
                >
                  {inCart ? t('collection_bundle.added') : t('collection_bundle.buy')}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomeBundles
