import React from 'react'
import { Network } from '@dcl/schemas'
import { Button } from 'decentraland-ui'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import onBackIcon from '../../../images/onBack.png'
import { isNFT, mapAsset } from '../../../modules/asset/utils'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { Sections } from '../../../modules/routing/types'
import { FavoritesCounter } from '../../FavoritesCounter'
import { Props } from './OnBack.types'
import './OnBack.css'

const OnBack = ({ asset, onBack }: Props) => {
  const isMobile = useMobileMediaQuery()

  return (
    <div className="top-header" data-testid="top-header">
      <Button
        className="back"
        onClick={() =>
          onBack(
            mapAsset(
              asset,
              {
                wearable: () =>
                  locations.browse({
                    assetType: AssetType.ITEM,
                    section: Sections.decentraland.WEARABLES
                  }),
                emote: () =>
                  locations.browse({
                    assetType: AssetType.ITEM,
                    section: Sections.decentraland.EMOTES
                  })
              },
              {
                ens: () =>
                  locations.browse({
                    assetType: AssetType.NFT,
                    section: Sections.decentraland.ENS
                  }),
                estate: () =>
                  locations.lands({
                    assetType: AssetType.NFT,
                    section: Sections.decentraland.ESTATES,
                    isMap: false,
                    isFullscreen: false
                  }),
                parcel: () =>
                  locations.lands({
                    assetType: AssetType.NFT,
                    section: Sections.decentraland.PARCELS,
                    isMap: false,
                    isFullscreen: false
                  }),
                wearable: () =>
                  locations.browse({
                    assetType: AssetType.NFT,
                    section: Sections.decentraland.WEARABLES
                  }),
                emote: () =>
                  locations.browse({
                    assetType: AssetType.NFT,
                    section: Sections.decentraland.EMOTES
                  })
              },
              () => undefined
            )
          )
        }
        basic
      >
        <img src={onBackIcon} alt={t('global.back')} />
        {t('global.back')}
      </Button>
      {isMobile && !isNFT(asset) && asset.network === Network.MATIC ? (
        <FavoritesCounter isCollapsed className="favorites" item={asset} />
      ) : null}
    </div>
  )
}

export default React.memo(OnBack)
