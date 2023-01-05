import { Icon } from 'decentraland-ui'
import styles from './Pill.module.css'

type Props = {
  id: string
  label: string
  onDelete: (id: string) => void
}

export const Pill = ({ id, label, onDelete }: Props): JSX.Element => (
  <div className={styles.pill}>
    {label}
    <Icon
      onClick={onDelete.bind(null, id)}
      name="times"
      className={styles.deleteBtn}
    />
  </div>
)
