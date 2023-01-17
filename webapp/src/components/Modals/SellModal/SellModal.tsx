/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Button, Field, ModalNavigation } from 'decentraland-ui'
import { ethers } from 'ethers'
import { Network, NFTCategory } from '@dcl/schemas'
import addDays from 'date-fns/addDays'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { ContractName } from 'decentraland-transactions'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { ChainButton, Modal } from 'decentraland-dapps/dist/containers'

import { getContractNames, VendorFactory } from '../../../modules/vendor'

import { getAssetName, isOwnedBy } from '../../../modules/asset/utils'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import {
  getDefaultExpirationDate,
  INPUT_FORMAT
} from '../../../modules/order/utils'
import { ManaField } from '../../ManaField'
import { parseMANANumber } from '../../../lib/mana'
import { Props } from './SellModal.types'
import './SellModal.css'

const SellModal = ({
  wallet,
  metadata: { nft, order },
  onClose,
  isSubmittingTransaction,
  isTransactionBeingConfirmed,
  onSubmitTransaction,
  error,
  getContract,
  onCreateOrder,
  authorizations
}: Props) => {
  console.log(
    isSubmittingTransaction,
    isTransactionBeingConfirmed,
    onSubmitTransaction,
    error
  )

  const isLoading = false
  const isUpdate = order !== null
  const [price, setPrice] = useState<string>(
    isUpdate ? ethers.utils.formatEther(order!.price) : ''
  )

  const [expiresAt, setExpiresAt] = useState(
    isUpdate && order!.expiresAt && isValid(order!.expiresAt)
      ? formatDate(addDays(order!.expiresAt, 1), INPUT_FORMAT)
      : getDefaultExpirationDate()
  )
  // const [showConfirm, setShowConfirm] = useState(false)

  // const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  if (!wallet) {
    return null
  }

  const contractNames = getContractNames()

  const marketplace = getContract({
    name: contractNames.MARKETPLACE,
    network: nft.network
  })

  if (!marketplace) {
    return null
  }

  const authorization: Authorization = {
    address: wallet.address,
    authorizedAddress: marketplace.address,
    contractAddress: nft.contractAddress,
    contractName:
      (nft.category === NFTCategory.WEARABLE ||
        nft.category === NFTCategory.EMOTE) &&
      nft.network === Network.MATIC
        ? ContractName.ERC721CollectionV2
        : ContractName.ERC721,
    chainId: nft.chainId,
    type: AuthorizationType.APPROVAL
  }

  const handleCreateOrder = () =>
    onCreateOrder(
      nft,
      parseMANANumber(price),
      new Date(`${expiresAt} 00:00:00`).getTime()
    )

  const handleSubmit = () => {
    if (hasAuthorization(authorizations, authorization)) {
      handleCreateOrder()
    } else {
      // setShowAuthorizationModal(true)
      // setShowConfirm(false)
    }
  }

  // const handleClose = () => setShowAuthorizationModal(false)

  const { orderService } = VendorFactory.build(nft.vendor)

  const isInvalidDate = new Date(`${expiresAt} 00:00:00`).getTime() < Date.now()
  const isInvalidPrice =
    parseMANANumber(price) <= 0 || parseFloat(price) !== parseMANANumber(price)
  const isDisabled =
    !orderService.canSell() ||
    !isOwnedBy(nft, wallet) ||
    isInvalidPrice ||
    isInvalidDate

  return (
    <Modal size="small" name={'SellModal'} onClose={onClose}>
      <ModalNavigation
        title={t(isUpdate ? 'sell_page.update_title' : 'sell_page.title')}
        onClose={onClose}
        subtitle={
          <T
            id={isUpdate ? 'sell_page.update_subtitle' : 'sell_page.subtitle'}
            values={{
              name: <b className="primary-text">{getAssetName(nft)}</b>
            }}
          />
        }
      />

      {/* <Form onSubmit={() => handleSubmit()}> */}
      <div className="fields-container">
        <ManaField
          label={t('sell_page.price')}
          type="text"
          placeholder={1000}
          network={nft.network}
          value={price}
          focus={true}
          error={price !== '' && isInvalidPrice}
          onChange={(_event, props) => {
            setPrice(toFixedMANAValue(props.value))
          }}
          className="mana-field"
        />
        <Field
          label={t('sell_page.expiration_date')}
          type="date"
          value={expiresAt}
          onChange={(_event, props) =>
            setExpiresAt(props.value || getDefaultExpirationDate())
          }
          error={isInvalidDate}
          message={isInvalidDate ? t('sell_page.invalid_date') : undefined}
        />
      </div>
      <Modal.Actions>
        <Button as="div" onClick={onClose}>
          {t('global.cancel')}
        </Button>
        <ChainButton
          onClick={() => handleSubmit()}
          primary
          disabled={isDisabled || isLoading}
          loading={isLoading}
          chainId={nft.chainId}
        >
          {t(isUpdate ? 'sell_page.update_submit' : 'sell_page.submit')}
        </ChainButton>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(SellModal)
