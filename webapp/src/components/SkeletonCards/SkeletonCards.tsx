import React from 'react'
import styles from './SkeletonCards.module.css'

const DEFAULT_COUNT = 12

/**
 * Card-shaped shimmer placeholders for a loading grid, ported from the shop.
 *
 * They replace the full-grid scrim and centred spinner the marketplace used to show. A scrim hides
 * whatever was already on screen and gives no clue how much is coming; placeholders hold the grid's
 * eventual shape, so the page does not jump when the real cards land.
 *
 * The 360px height is the marketplace AssetCard's own, restated rather than imported: it is that
 * component's geometry, not a shared token. Purely decorative, hence aria-hidden, but carrying a
 * testid because "is the loading state showing" is what a spec needs to assert.
 */
const SkeletonCards = ({ count = DEFAULT_COUNT }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className={styles.skeletonCard} aria-hidden data-testid="skeleton-card" />
    ))}
  </>
)

export default React.memo(SkeletonCards)
