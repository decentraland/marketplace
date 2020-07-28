import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'

import { isOwnedBy } from '../../../modules/nft/utils'
import { locations } from '../../../modules/routing/locations'
import { VendorFactory } from '../../../modules/vendor'
import { getOriginURL } from '../../../modules/vendor/utils'
import { Props } from './Actions.types'

const Actions = (props: Props) => {
  const { wallet, nft, order } = props
  const { vendor, contractAddress, tokenId } = nft

  const [showLeavingSiteModal, setShowLeavingSiteModal] = useState(false)

  const isOwner = isOwnedBy(nft, wallet)

  const { bidService, orderService } = VendorFactory.build(nft.vendor)
  const hasBids = bidService !== undefined
  const canSell = orderService.canSell()

  return (
    <>
      {order ? (
        isOwner && canSell ? (
          <>
            <Button
              as={Link}
              to={locations.sell(contractAddress, tokenId)}
              primary
            >
              {t('nft_page.update')}
            </Button>
            <Button as={Link} to={locations.cancel(contractAddress, tokenId)}>
              {t('nft_page.cancel_sale')}
            </Button>
          </>
        ) : (
          <>
            <Button
              as={Link}
              to={locations.buy(contractAddress, tokenId)}
              primary
            >
              {t('nft_page.buy')}
            </Button>
            {hasBids ? (
              <Button as={Link} to={locations.bid(contractAddress, tokenId)}>
                {t('nft_page.bid')}
              </Button>
            ) : null}
          </>
        )
      ) : isOwner && canSell ? (
        <Button as={Link} to={locations.sell(contractAddress, tokenId)} primary>
          {t('nft_page.sell')}
        </Button>
      ) : isOwner && !canSell ? (
        <Button onClick={() => setShowLeavingSiteModal(true)} primary>
          {t('nft_page.sell')}
        </Button>
      ) : hasBids ? (
        <Button as={Link} to={locations.bid(contractAddress, tokenId)} primary>
          {t('nft_page.bid')}
        </Button>
      ) : null}
      {isOwner && !order ? (
        <Button as={Link} to={locations.transfer(contractAddress, tokenId)}>
          {t('nft_page.transfer')}
        </Button>
      ) : null}

      <Modal
        className="LeavingSiteModal"
        size="small"
        open={showLeavingSiteModal}
        onClose={() => setShowLeavingSiteModal(false)}
      >
        <Modal.Header>{t('nft_page.leaving_decentraland')}</Modal.Header>
        <Modal.Content>
          <p>
            <T
              id="nft_page.leaving_decentraland_description"
              values={{
                vendor: t(`vendors.${vendor}`),
                vendor_link: (
                  <a
                    href={getOriginURL(vendor)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getOriginURL(vendor)}
                  </a>
                )
              }}
            />
            <br />
            <br />
            <small>
              <i>{t('nft_page.leaving_decentraland_disclaimer')}</i>
            </small>
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowLeavingSiteModal(false)}>
            {t('global.cancel')}
          </Button>
          <Button
            primary
            as="a"
            href={nft.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowLeavingSiteModal(false)}
          >
            {t('global.proceed')}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default React.memo(Actions)
