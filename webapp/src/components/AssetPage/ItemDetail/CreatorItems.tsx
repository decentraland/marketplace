import React, { useMemo, useState } from 'react'
import { Item } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { AssetCard } from '../../AssetCard'
import styles from './CreatorItems.module.css'

type Props = {
  items: Item[]
  isLoading: boolean
  currentContractAddress: string
}

const PAGE_SIZE = 5

// "Other Items from the Creator": a horizontal, paginated slider of the
// creator's other items (Trending-Items pattern). Reuses the real AssetCard so
// the cards behave exactly like everywhere else (hover, add to cart, etc.).
const CreatorItems = ({ items, isLoading, currentContractAddress }: Props) => {
  const others = useMemo(() => items.filter(item => item.contractAddress !== currentContractAddress), [items, currentContractAddress])
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(others.length / PAGE_SIZE)

  if (!isLoading && others.length === 0) return null

  const start = page * PAGE_SIZE
  const pageItems = others.slice(start, start + PAGE_SIZE)
  const prev = () => setPage(p => (p - 1 + totalPages) % totalPages)
  const next = () => setPage(p => (p + 1) % totalPages)

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>{t('creator_items.title')}</h2>
      <div className={styles.carousel}>
        {totalPages > 1 ? (
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="previous">
            <Icon name="chevron left" />
          </button>
        ) : null}

        <div className={styles.row}>
          {pageItems.map(item => (
            <AssetCard key={item.id} asset={item} />
          ))}
        </div>

        {totalPages > 1 ? (
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="next">
            <Icon name="chevron right" />
          </button>
        ) : null}
      </div>

      {totalPages > 1 ? (
        <div className={styles.dots}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === page ? styles.dotActive : ''}`} onClick={() => setPage(i)} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default React.memo(CreatorItems)
