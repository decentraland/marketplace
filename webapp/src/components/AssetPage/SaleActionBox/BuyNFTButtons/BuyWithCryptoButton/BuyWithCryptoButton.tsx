import { Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Button, Mana } from 'decentraland-ui'
import { Props } from './BuyWithCryptoButton.types'

export const BuyWithCryptoButton = (props: Props) => {
  return (
    <Button primary fluid {...props}>
      <Mana inline size="small" network={Network.MATIC} />
      {t('asset_page.actions.buy_with_crypto')}
    </Button>
  )
}
