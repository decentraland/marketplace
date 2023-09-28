import classNames from 'classnames'
import styles from './SearchBarDropdownOptionSkeleton.module.css'

type SearchBarDropdownOptionSkeletonProps = {
  shape?: 'rect' | 'circle'
  lines?: 1 | 2
}

const SearchBarDropdownOptionSkeleton = ({
  shape = 'rect',
  lines = 2
}: SearchBarDropdownOptionSkeletonProps) => {
  return (
    <div className={styles.skeletonContainer}>
      <div
        className={classNames(
          styles.assetImageSkeleton,
          shape === 'rect' ? styles.rectangle : styles.circle
        )}
      />
      <div className={styles.skeletonDataContainer}>
        <span className={styles.itemNameSkeleton} />
        {lines > 1 ? <span className={styles.creatorSkeleton} /> : null}
      </div>
    </div>
  )
}

export default SearchBarDropdownOptionSkeleton
