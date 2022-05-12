import React, { useState } from 'react'
import { Network, NFTCategory } from '@dcl/schemas'
import { fromWei } from 'web3x/utils'
import dateFnsFormat from 'date-fns/format'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import { Header, Form, Field, Button } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'
import { toMANA, fromMANA } from '../../../lib/mana'
import {
  INPUT_FORMAT,
  getDefaultExpirationDate
} from '../../../modules/order/utils'
import { locations } from '../../../modules/routing/locations'
import { VendorFactory } from '../../../modules/vendor/VendorFactory'
import { getAssetName, isOwnedBy } from '../../../modules/asset/utils'
import { AuthorizationModal } from '../../AuthorizationModal'
import { AssetAction } from '../../AssetAction'
import { Mana } from '../../Mana'
import { ManaField } from '../../ManaField'
import { getContractNames } from '../../../modules/vendor'
import { getContract } from '../../../modules/contract/utils'
import { ConfirmInputValueModal } from '../../ConfirmInputValueModal'
import { Props } from './SellModal.types'

const SellModal = (props: Props) => {
  const {
    nft,
    order,
    wallet,
    authorizations,
    isLoading,
    isCreatingOrder,
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

  const authorization: Authorization = {
    address: wallet.address,
    authorizedAddress: marketplace.address,
    contractAddress: nft.contractAddress,
    contractName:
      nft.category === NFTCategory.WEARABLE && nft.network === Network.MATIC
        ? ContractName.ERC721CollectionV2
        : ContractName.ERC721,
    chainId: nft.chainId,
    type: AuthorizationType.APPROVAL
  }

  const handleCreateOrder = () =>
    onCreateOrder(nft, fromMANA(price), new Date(expiresAt).getTime())

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

  const isInvalidDate = new Date(expiresAt).getTime() < Date.now()
  const isDisabled =
    !orderService.canSell() ||
    !isOwnedBy(nft, wallet) ||
    fromMANA(price) <= 0 ||
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
            placeholder={toMANA(1000)}
            network={nft.network}
            value={price}
            focus={true}
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
            message={isInvalidDate ? t('sell_page.invalid_date') : undefined}
          />
        </div>
        <div className="buttons">
          <Button
            as="div"
            onClick={() =>
              onNavigate(locations.nft(nft.contractAddress, nft.tokenId))
            }
          >
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
                    {fromMANA(price).toLocaleString()}
                  </Mana>
                )
              }}
            />
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
