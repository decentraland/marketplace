import React, { useState, useCallback, useEffect } from 'react'
import { fromWei } from 'web3x-es/utils'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import dateFnsFormat from 'date-fns/format'
import { Header, Form, Field, Button, Modal, Mana } from 'decentraland-ui'

import { toMANA, fromMANA } from '../../../lib/mana'
import {
  INPUT_FORMAT,
  getDefaultExpirationDate
} from '../../../modules/order/utils'
import { getNFTName, isOwnedBy } from '../../../modules/nft/utils'
import { locations } from '../../../modules/routing/locations'
import { hasAuthorization } from '../../../modules/authorization/utils'
import { contractAddresses } from '../../../modules/contract/utils'
import { VendorFactory } from '../../../modules/vendor/VendorFactory'
import { AuthorizationType } from '../../AuthorizationModal/AuthorizationModal.types'
import { AuthorizationModal } from '../../AuthorizationModal'
import { NFTAction } from '../../NFTAction'
import { Props } from './SellModal.types'

const SellModal = (props: Props) => {
  const {
    nft,
    order,
    wallet,
    authorizations,
    onNavigate,
    onCreateOrder
  } = props

  const isUpdate = order !== null
  const [price, setPrice] = useState(
    isUpdate ? toMANA(+fromWei(order!.price, 'ether')) : ''
  )
  const [expiresAt, setExpiresAt] = useState(
    isUpdate && order!.expiresAt
      ? dateFnsFormat(+order!.expiresAt, INPUT_FORMAT)
      : getDefaultExpirationDate()
  )
  const [confirmPrice, setConfirmPrice] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  const handleCreateOrder = useCallback(
    () => onCreateOrder(nft, fromMANA(price), new Date(expiresAt).getTime()),
    [nft, price, expiresAt, onCreateOrder]
  )

  const handleSubmit = useCallback(() => {
    if (
      hasAuthorization(
        authorizations,
        contractAddresses.Marketplace,
        nft.contractAddress,
        AuthorizationType.APPROVAL
      )
    ) {
      handleCreateOrder()
    } else {
      setShowAuthorizationModal(true)
      setShowConfirm(false)
    }
  }, [authorizations, nft, handleCreateOrder, setShowAuthorizationModal])

  const handleClose = useCallback(() => setShowAuthorizationModal(false), [
    setShowAuthorizationModal
  ])

  const { orderService } = VendorFactory.build(nft.vendor)

  const isInvalidDate = new Date(expiresAt).getTime() < Date.now()
  const isDisabled =
    !orderService.canSell() ||
    !isOwnedBy(nft, wallet) ||
    fromMANA(price) <= 0 ||
    isInvalidDate

  // Clear confirm price when closing the confirm modal
  useEffect(() => {
    if (!showConfirm) {
      setConfirmPrice('')
    }
  }, [nft, showConfirm, setConfirmPrice])

  return (
    <NFTAction nft={nft}>
      <Header size="large">
        {t(isUpdate ? 'sell_page.update_title' : 'sell_page.title')}
      </Header>
      <p className="subtitle">
        <T
          id={isUpdate ? 'sell_page.update_subtitle' : 'sell_page.subtitle'}
          values={{
            name: <b className="primary-text">{getNFTName(nft)}</b>
          }}
        />
      </p>

      <Form onSubmit={() => setShowConfirm(true)}>
        <div className="form-fields">
          <Field
            label={t('sell_page.price')}
            type="text"
            placeholder={toMANA(1000)}
            value={price}
            onChange={(_event, props) => {
              const newPrice = fromMANA(props.value)
              setPrice(toMANA(newPrice))
            }}
          />
          <Field
            label={t('sell_page.expiration_date')}
            type="date"
            value={expiresAt}
            onChange={(_event, props) =>
              setExpiresAt(props.value || getDefaultExpirationDate())
            }
            error={isInvalidDate}
            nft
            message={isInvalidDate ? t('sell_page.invalid_date') : undefined}
          />
        </div>
        <div className="buttons">
          <div
            className="ui button"
            onClick={() =>
              onNavigate(locations.nft(nft.contractAddress, nft.tokenId))
            }
          >
            {t('global.cancel')}
          </div>
          <Button type="submit" primary disabled={isDisabled}>
            {t(isUpdate ? 'sell_page.update_submit' : 'sell_page.submit')}
          </Button>
        </div>
      </Form>

      <Modal size="small" open={showConfirm} className="ConfirmPriceModal">
        <Modal.Header>{t('sell_page.confirm.title')}</Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Content>
            <T
              id="sell_page.confirm.line_one"
              values={{
                name: <b>{getNFTName(nft)}</b>,
                amount: <Mana inline>{fromMANA(price).toLocaleString()}</Mana>
              }}
            />
            <br />
            <T id="sell_page.confirm.line_two" />
            <Field
              label={t('sell_page.price')}
              placeholder={price}
              value={confirmPrice}
              onChange={(_event, props) => {
                const newPrice = fromMANA(props.value)
                setConfirmPrice(toMANA(newPrice))
              }}
            />
          </Modal.Content>
          <Modal.Actions>
            <div
              className="ui button"
              onClick={() => {
                setConfirmPrice('')
                setShowConfirm(false)
              }}
            >
              {t('global.cancel')}
            </div>
            <Button
              type="submit"
              primary
              disabled={fromMANA(price) !== fromMANA(confirmPrice)}
            >
              {t('global.proceed')}
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
      <AuthorizationModal
        open={showAuthorizationModal}
        contractAddress={contractAddresses.Marketplace}
        tokenAddress={nft.contractAddress}
        type={AuthorizationType.APPROVAL}
        onProceed={handleCreateOrder}
        onCancel={handleClose}
      />
    </NFTAction>
  )
}

export default React.memo(SellModal)
