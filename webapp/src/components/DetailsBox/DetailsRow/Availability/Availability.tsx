import { memo } from 'react'

import { NFTCategory, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isNFT } from '../../../../modules/asset/utils'
import { Info } from '../../Info'
import { Props } from '../DetailsRow.types'

export const Availability = (props: Props) => {
  const { asset } = props

  return isNFT(asset) ? (
    asset.issuedId ? (
      <Info title={t('details_box.issue_number')}>
        {Number(asset.issuedId).toLocaleString()}
        <span>
          /
          {Rarity.getMaxSupply(
            asset.category === NFTCategory.WEARABLE
              ? asset.data.wearable!.rarity
              : asset.data.emote!.rarity
          ).toLocaleString()}
        </span>
      </Info>
    ) : null
  ) : (
    <Info title={t('details_box.stock')}>
      {asset.available > 0 ? (
        <>
          {asset.available.toLocaleString()}
          <span>/{Rarity.getMaxSupply(asset.rarity).toLocaleString()}</span>
        </>
      ) : (
        t('asset_page.sold_out')
      )}
    </Info>
  )
}

export default memo(Availability)
