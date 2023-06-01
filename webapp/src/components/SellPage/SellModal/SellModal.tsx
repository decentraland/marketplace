import React, { useState } from 'react'
import { ethers } from 'ethers'
import addDays from 'date-fns/addDays'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import { Network, NFTCategory } from '@dcl/schemas'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import { Header, Form, Field, Button } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'
import { parseMANANumber } from '../../../lib/mana'
import {
  INPUT_FORMAT,
  getDefaultExpirationDate
} from '../../../modules/order/utils'
import { VendorFactory } from '../../../modules/vendor/VendorFactory'
import { getAssetName, isOwnedBy } from '../../../modules/asset/utils'
import { getContractNames } from '../../../modules/vendor'
import { AuthorizationModal } from '../../AuthorizationModal'
import { AssetAction } from '../../AssetAction'
import { Mana } from '../../Mana'
import { ManaField } from '../../ManaField'
import { ConfirmInputValueModal } from '../../ConfirmInputValueModal'
import { Props } from './SellModal.types'
import { showPriceBelowMarketValueWarning } from './utils'

const SellModal = (props: Props) => {
  const {
    nft,
    order,
    wallet,
    authorizations,
    isLoading,
    isCreatingOrder,
    getContract,
    onGoBack,
    onCreateOrder
  } = props

  const isUpdate = order !== null
  const [price, setPrice] = useState<string>(
    isUpdate ? ethers.utils.formatEther(order!.price) : ''
  )

  const [expiresAt, setExpiresAt] = useState(
    isUpdate && order!.expiresAt && isValid(order!.expiresAt)
      ? formatDate(addDays(order!.expiresAt, 1), INPUT_FORMAT)
      : getDefaultExpirationDate()
  )
  const [showConfirm, setShowConfirm] = useState(false)

  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

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
      setShowAuthorizationModal(true)
      setShowConfirm(false)
    }
  }

  const handleClose = () => setShowAuthorizationModal(false)

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
    <AssetAction asset={nft}>
      <Header size="large">
        {t(isUpdate ? 'sell_page.update_title' : 'sell_page.title')}
      </Header>
      <p className="subtitle">
        <T
          id={isUpdate ? 'sell_page.update_subtitle' : 'sell_page.subtitle'}
          values={{
            name: <b className="primary-text">{getAssetName(nft)}</b>
          }}
        />
      </p>

      <Form onSubmit={() => setShowConfirm(true)}>
        <div className="form-fields">
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
        <div className="buttons">
          <Button as="div" onClick={onGoBack}>
            {t('global.cancel')}
          </Button>
          <ChainButton
            type="submit"
            primary
            disabled={isDisabled || isLoading}
            loading={isLoading}
            chainId={nft.chainId}
          >
            {t(isUpdate ? 'sell_page.update_submit' : 'sell_page.submit')}
          </ChainButton>
        </div>
      </Form>
      <ConfirmInputValueModal
        open={showConfirm}
        headerTitle={t('sell_page.confirm.title')}
        content={
          <>
            <T
              id="sell_page.confirm.line_one"
              values={{
                name: <b>{getAssetName(nft)}</b>,
                amount: (
                  <Mana network={nft.network} inline>
                    {parseMANANumber(price).toLocaleString()}
                  </Mana>
                )
              }}
            />
            {showPriceBelowMarketValueWarning(nft, parseMANANumber(price)) && (
              <>
                <br />
                <p className="danger-text">
                  <T id="sell_page.confirm.warning" />
                </p>
              </>
            )}
            <br />
            <T id="sell_page.confirm.line_two" />
          </>
        }
        onConfirm={handleSubmit}
        valueToConfirm={price}
        network={nft.network}
        onCancel={() => setShowConfirm(false)}
        loading={isCreatingOrder}
        disabled={isCreatingOrder}
      />
      <AuthorizationModal
        open={showAuthorizationModal}
        authorization={authorization}
        isLoading={isCreatingOrder}
        onProceed={handleCreateOrder}
        onCancel={handleClose}
      />
    </AssetAction>
  )
}

export default React.memo(SellModal)
