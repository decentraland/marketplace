import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Mobile, NotMobile, Popup, Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getIsLegacyOrderExpired, isLegacyOrder } from '../../../lib/orders'
import { locations } from '../../../modules/routing/locations'
import {
  LEGACY_MARKETPLACE_MAINNET_CONTRACT,
  Section
} from '../../../modules/vendor/decentraland'
import { Mana } from '../../Mana'
import { formatWeiMANA } from '../../../lib/mana'
import { Props } from './OnSaleListElement.types'
import AssetCell from '../AssetCell'
import './OnSaleListElement.css'

const OnSaleListElement = ({
  nft,
  item,
  order,
  isAuthorized,
  authorization,
  onRevoke
}: Props) => {
  const category = item?.category || nft!.category

  const cancelOrSellOptions = {
    redirectTo: locations.currentAccount({
      section: Section.ON_SALE
    })
  }

  return (
    <>
      <Mobile>
        <div className="mobile-row">
          <AssetCell asset={item || nft!} />
          <Mana showTooltip network={item?.network || nft!.network} inline>
            {formatWeiMANA(item?.price || order!.price)}
          </Mana>
        </div>
      </Mobile>
      <NotMobile>
        <Table.Row>
          <Table.Cell>
            <div className="nameCell">
              <AssetCell asset={item || nft!} />
              {order && isLegacyOrder(order) ? (
                <Popup
                  content={
                    getIsLegacyOrderExpired(order.expiresAt)
                      ? t('asset_page.actions.legacy_order_expired_warning')
                      : t('asset_page.actions.legacy_order_not_expired_warning')
                  }
                  position="top center"
                  trigger={
                    <div className="warningExpiration">
                      <Icon
                        name="exclamation triangle"
                        className={'warningExpiration'}
                      />{' '}
                      {t('global.action_required')}
                    </div>
                  }
                  on="hover"
                />
              ) : null}
            </div>
          </Table.Cell>
          <Table.Cell>{t(`global.${category}`)}</Table.Cell>
          <Table.Cell>
            {t(`global.${item ? 'primary' : 'secondary'}`)}
          </Table.Cell>
          <Table.Cell>
            <Mana showTooltip network={item?.network || nft!.network} inline>
              {formatWeiMANA(item?.price || order!.price)}
            </Mana>
          </Table.Cell>
          <Table.Cell>
            {order?.marketplaceAddress ===
              LEGACY_MARKETPLACE_MAINNET_CONTRACT &&
            isAuthorized &&
            authorization ? (
              <Button
                onClick={() => authorization && onRevoke?.(authorization)}
                primary
              >
                {t('account_page.revoke')}
              </Button>
            ) : order && nft && isLegacyOrder(order) ? (
              getIsLegacyOrderExpired(order.expiresAt) ? (
                <Button
                  as={Link}
                  to={locations.cancel(
                    nft.contractAddress,
                    nft.tokenId,
                    cancelOrSellOptions
                  )}
                  primary
                >
                  {t('asset_page.actions.terminate_listing')}
                </Button>
              ) : (
                <Button
                  as={Link}
                  to={locations.sell(
                    nft.contractAddress,
                    nft.tokenId,
                    cancelOrSellOptions
                  )}
                  inverted
                  fluid
                >
                  {t('asset_page.actions.update_sale')}
                </Button>
              )
            ) : null}
          </Table.Cell>
        </Table.Row>
      </NotMobile>
    </>
  )
}

export default React.memo(OnSaleListElement)
