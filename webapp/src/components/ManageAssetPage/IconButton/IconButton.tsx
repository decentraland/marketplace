import { Button } from 'decentraland-ui/dist/components/Button/Button'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'
import classNames from 'classnames'
import { Props } from './IconButton.types'
import styles from './IconButton.module.css'

export const IconButton = (props: Props) => {
  const { onClick, className, iconName, disabled = false } = props

  return (
    <Button
      className={classNames(className, styles.button)}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className={styles.icon} name={iconName} />
    </Button>
  )
}
