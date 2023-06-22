import { Icon } from 'decentraland-ui'
import classNames from 'classnames'
import styles from './Pill.module.css'

type Props = {
  id: string
  label: string
  className?: string
  onDelete: (id: string) => void
}

export const Pill = ({
  id,
  label,
  className,
  onDelete
}: Props): JSX.Element => {
  return (
    <div
      className={classNames(styles.pill, className)}
      data-testid={`pill-${id}`}
    >
      {label}
      <button
        onClick={onDelete.bind(null, id)}
        data-testid="b"
        className={styles.deleteBtn}
      >
        <Icon name="times" />
      </button>
    </div>
  )
}
