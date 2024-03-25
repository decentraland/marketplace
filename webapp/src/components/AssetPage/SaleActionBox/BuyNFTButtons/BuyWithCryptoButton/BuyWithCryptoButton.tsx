import { useCallback } from 'react'
import { NFTCategory, Network } from '@dcl/schemas'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Button, ButtonProps, Mana } from 'decentraland-ui'
import { isNFT } from '../../../../../modules/asset/utils'
import * as events from '../../../../../utils/events'
import { Props } from './BuyWithCryptoButton.types'

export const BuyWithCryptoButton = (props: Props) => {
  const { asset, onClick, ...rest } = props

  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
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
