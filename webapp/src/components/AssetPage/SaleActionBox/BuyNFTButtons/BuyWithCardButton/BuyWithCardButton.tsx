import { Icon, Button } from 'decentraland-ui'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation'
import styles from './BuyWithCardButton.module.css'
import { Props } from './BuyWithCardButton.types'

export const BuyWithCardButton = (props: Props) => {
  const { className, ...otherProps } = props

  return (
    <Button
      className={classNames(styles.buy_with_card, className)}
      fluid
      {...otherProps}
    >
      <Icon name="credit card outline" />
      {t('asset_page.actions.buy_with_card')}
    </Button>
  )
}
