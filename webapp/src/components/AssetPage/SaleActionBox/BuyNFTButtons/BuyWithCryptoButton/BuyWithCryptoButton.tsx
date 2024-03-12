import { useCallback } from 'react'
import { NFTCategory, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics'
import { Button, Mana } from 'decentraland-ui'
import * as events from '../../../../../utils/events'
import { isNFT } from '../../../../../modules/asset/utils'
import { Props } from './BuyWithCryptoButton.types'

export const BuyWithCryptoButton = (props: Props) => {
  const { asset, onClick, ...rest } = props

  const handleOnClick = useCallback(
    (e, data) => {
      const isClaimingName = isNFT(asset) && asset.category === NFTCategory.ENS && !asset.tokenId
      const isMint = !!asset.itemId || isClaimingName
      getAnalytics().track(events.BUY_WITH_CRYPTO, {
        transaction_type: isMint ? 'mint' : 'secondary',
        contract_address: isClaimingName ? undefined : asset.contractAddress,
        token_id: isClaimingName ? undefined : isNFT(asset) ? asset.tokenId : asset.itemId,
        category: asset.category
      })
      onClick?.(e, data)
    },
    [props.asset, onClick]
  )

  return (
    <Button primary fluid {...rest} onClick={handleOnClick}>
      <Mana inline size="small" network={Network.MATIC} />
      {t('asset_page.actions.buy_with_crypto')}
    </Button>
  )
}
