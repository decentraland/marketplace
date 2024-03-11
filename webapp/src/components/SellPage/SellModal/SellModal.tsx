import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import addDays from 'date-fns/addDays'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { Contract, Network, NFTCategory } from '@dcl/schemas'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { ChainButton, withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { Header, Form, Field, Button } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'
import { parseMANANumber } from '../../../lib/mana'
import { INPUT_FORMAT, getDefaultExpirationDate } from '../../../modules/order/utils'
import { VendorFactory } from '../../../modules/vendor/VendorFactory'
import { getAssetName, isOwnedBy } from '../../../modules/asset/utils'
import { getContractNames } from '../../../modules/vendor'
import { isStubMaticCollectionContract } from '../../../modules/contract/utils'
import { getSellItemStatus, getError } from '../../../modules/order/selectors'
import ERC721ABI from '../../../contracts/ERC721.json'
import { Contract as DCLContract } from '../../../modules/vendor/services'
import { AssetAction } from '../../AssetAction'
import { Mana } from '../../Mana'
import { ManaField } from '../../ManaField'
import { ConfirmInputValueModal } from '../../ConfirmInputValueModal'
import { Props } from './SellModal.types'
import { showPriceBelowMarketValueWarning } from './utils'

const SellModal = (props: Props) => {
  const { nft, order, wallet, isLoading, isCreatingOrder, getContract, onGoBack, onCreateOrder, onAuthorizedAction, onClearOrderErrors } =
    props

  const isUpdate = order !== null
  const [price, setPrice] = useState<string>(isUpdate ? ethers.utils.formatEther(order.price) : '')

  const [expiresAt, setExpiresAt] = useState(() => {
    let exp = order?.expiresAt

    if (isUpdate && exp) {
      // If the order's expiration is in seconds, convert it to milliseconds
      if (exp.toString().length === 10) {
        exp = exp * 1000
      }

      if (isValid(exp)) {
        return formatDate(addDays(exp, 1), INPUT_FORMAT)
      }
    }

    return getDefaultExpirationDate()
  })

  const [showConfirm, setShowConfirm] = useState(false)
  const [targetContractLabel, setTargetContractLabel] = useState<string>()

  const nftContract = getContract({
    address: nft?.contractAddress,
    network: nft.network
  }) as DCLContract

  useEffect(() => {
    if (nftContract.address && isStubMaticCollectionContract(nftContract)) {
      const fetchContractName = async () => {
        try {
          const provider = await getNetworkProvider(nftContract.chainId)

          const erc721 = new ethers.Contract(nftContract.address, ERC721ABI, new ethers.providers.Web3Provider(provider))

          const name = await erc721.name()
          setTargetContractLabel(name)
        } catch (e) {
          console.warn('Could not fetch contract name')
        }
      }

      fetchContractName()
    }
  }, [nftContract])

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

  const handleCreateOrder = () => onCreateOrder(nft, parseMANANumber(price), new Date(`${expiresAt} 00:00:00`).getTime())

  const handleSubmit = () => {
    onClearOrderErrors()
    onAuthorizedAction({
      authorizationType: AuthorizationType.APPROVAL,
      authorizedAddress: marketplace.address,
      authorizedContractLabel: marketplace?.label || marketplace.name,
      targetContract: nftContract as Contract,
      targetContractName:
        (nft.category === NFTCategory.WEARABLE || nft.category === NFTCategory.EMOTE) && nft.network === Network.MATIC
          ? ContractName.ERC721CollectionV2
          : ContractName.ERC721,
      targetContractLabel: targetContractLabel || nftContract.label || nftContract.name,
      onAuthorized: handleCreateOrder,
      tokenId: nft.tokenId
    })
  }

  const { orderService } = VendorFactory.build(nft.vendor)

  const isInvalidDate = new Date(`${expiresAt} 00:00:00`).getTime() < Date.now()
  const isInvalidPrice = parseMANANumber(price) <= 0 || parseFloat(price) !== parseMANANumber(price)
  const isDisabled = !orderService.canSell() || !isOwnedBy(nft, wallet) || isInvalidPrice || isInvalidDate

  return (
    <AssetAction asset={nft}>
      <Header size="large">{t(isUpdate ? 'sell_page.update_title' : 'sell_page.title')}</Header>
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
            onChange={(_event, props) => setExpiresAt(props.value || getDefaultExpirationDate())}
            error={isInvalidDate}
            message={isInvalidDate ? t('sell_page.invalid_date') : undefined}
          />
        </div>
        <div className="buttons">
          <Button as="div" onClick={onGoBack}>
            {t('global.cancel')}
          </Button>
          <ChainButton type="submit" primary disabled={isDisabled || isLoading} loading={isLoading} chainId={nft.chainId}>
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
    </AssetAction>
  )
}

export default React.memo(
  withAuthorizedAction(
    SellModal,
    AuthorizedAction.SELL,
    {
      confirm_transaction: {
        title: 'sell_page.authorization.confirm_transaction_title'
      },
      title: 'sell_page.authorization.title'
    },
    getSellItemStatus,
    getError
  )
)
