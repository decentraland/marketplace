import classNames from 'classnames'
import { Button, Icon } from 'decentraland-ui'
import { Props } from './IconButton.types'
import styles from './IconButton.module.css'

export const IconButton = (props: Props) => {
  const { onClick, className, iconName, disabled = false } = props

  return (
    <Button className={classNames(className, styles.button)} onClick={onClick} disabled={disabled}>
      <Icon className={styles.icon} name={iconName} />
    </Button>
  )
}
