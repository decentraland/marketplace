import { t } from 'decentraland-dapps/dist/modules/translation'
import { Button, Mana } from 'decentraland-ui'
import { Props } from './BuyWithCryptoButton.types'

export const BuyWithCryptoButton = (props: Props) => {
  const { assetNetwork, ...otherProps } = props
  return (
    <Button primary fluid {...otherProps}>
      <Mana showTooltip inline size="small" network={assetNetwork} />
      {t('asset_page.actions.buy_with_crypto')}
    </Button>
  )
}
