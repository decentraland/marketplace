import React from 'react'
import { Link } from 'react-router-dom'
import { Network, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Icon, Popup } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import mintingIcon from '../../images/minting.png'
import infoIcon from '../../images/infoIcon.png'
import Mana from '../Mana/Mana'
import { formatWeiToAssetCard } from '../AssetCard/utils'
import { ManaToFiat } from '../ManaToFiat'
import { AvailableForMintPopupType } from './AssetImage.types'
import './AssetImage.css'

const AvailableForMintPopup = ({ price, stock, rarity, contractAddress, itemId, network }: AvailableForMintPopupType) => {
  return (
    <div className="AvailableForMintPopup">
      <div className="popupPreview">
        <img src={mintingIcon} alt="mint" className="mintIcon" />
        <span className="previewText">
          <span className="title">{t('asset_page.available_for_mint_popup.available_for_mint')}</span>
          <br />
          {t('asset_page.available_for_mint_popup.buy_directly')}
        </span>
        <Button inverted as={Link} to={locations.item(contractAddress, itemId)} className="goToItemButton">
          <Icon name="chevron right" className="goToItem" />
        </Button>
      </div>
      <div className="popupExtraInformation">
        <div className="extraInfoContainer">
          <span className="informationTitle">
            {t('best_buying_option.minting.price').toUpperCase()}&nbsp;
            <Popup
              content={
                network === Network.MATIC ? t('best_buying_option.minting.polygon_mana') : t('best_buying_option.minting.ethereum_mana')
              }
              position="top center"
              trigger={<img src={infoIcon} alt="info" className="informationTooltip" />}
              on="hover"
            />
          </span>
          <div className="containerRow">
            <div className="informationBold">
              <Mana withTooltip size="large" network={network as Network} className="informationBold">
                {formatWeiToAssetCard(price)}
              </Mana>
            </div>
            {+price > 0 && (
              <div className="informationText">
                {'('}
                <ManaToFiat mana={price} />
                {')'}
              </div>
            )}
          </div>
        </div>
        <div className="extraInfoContainer">
          <span className="informationTitle">{t('best_buying_option.minting.stock').toUpperCase()}</span>
          <span className="stockText">
            {stock.toLocaleString()}/ {Rarity.getMaxSupply(rarity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AvailableForMintPopup)
