import { Icon } from 'decentraland-ui'
import styles from './Pill.module.css'

type Props = {
  id: string
  label: string
  onDelete: (id: string) => void
}

export const Pill = ({ id, label, onDelete }: Props): JSX.Element => {
  return (
    <div className={styles.pill} data-testid={`pill-${id}`}>
      {label}
      <button onClick={onDelete.bind(null, id)} data-testid="b" className={styles.deleteBtn}>
        <Icon name="times" />
      </button>
    </div>
  )
}
