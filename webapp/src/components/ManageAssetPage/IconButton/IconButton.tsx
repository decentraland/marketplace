import { Button, Icon } from 'decentraland-ui'
import classNames from 'classnames'
import { Props } from './IconButton.types'
import styles from './IconButton.module.css'

export const IconButton = (props: Props) => {
  const { onClick, className, iconName } = props

  return (
    <Button className={classNames(className, styles.button)} onClick={onClick}>
      <Icon className={styles.icon} name={iconName} />
    </Button>
  )
}
