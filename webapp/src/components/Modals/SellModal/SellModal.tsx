import React, { useCallback, useMemo, useState } from 'react'
import addDays from 'date-fns/addDays'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import { ethers } from 'ethers'
import { Network, NFTCategory, Contract } from '@dcl/schemas'
import { ChainButton, Modal, withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName, getContract as getDecentralandContract } from 'decentraland-transactions'
import { Button, Field, Mana, Message, ModalNavigation } from 'decentraland-ui'
import { formatWeiMANA, parseMANANumber } from '../../../lib/mana'
import { getAssetName, isOwnedBy } from '../../../modules/asset/utils'
import { useFingerprint } from '../../../modules/nft/hooks'
import { getSellItemStatus, getError } from '../../../modules/order/selectors'
import { getDefaultExpirationDate, INPUT_FORMAT } from '../../../modules/order/utils'
import { VendorFactory } from '../../../modules/vendor'
import ErrorBanner from '../../ErrorBanner'
import { ManaField } from '../../ManaField'
import { showPriceBelowMarketValueWarning } from '../../SellPage/SellModal/utils'
import { Props } from './SellModal.types'
import styles from './SellModal.module.css'

enum StepperValues {
  SELL_MODAL = 'SELL_MODAL',
  CONFIRM_INPUT = 'CONFIRM_INPUT',
  AUTHORIZE = 'AUTHORIZE',
  CANCEL = 'CANCEL'
}

const SellModal = ({
  wallet,
  metadata: { nft, order },
  onClose,
  getContract,
  onCreateOrder,
  isLoadingAuthorization,
  authorizationError,
  onAuthorizedAction,
  isCreatingOrder,
  error,
  isCancelling,
  isOffchainPublicNFTOrdersEnabled,
  onCancelOrder
}: Props) => {
  const { orderService } = VendorFactory.build(nft.vendor)

  const [confirmedInput, setConfirmedInput] = useState<string>('')

  const shouldRemoveOffChainListing = !!order?.tradeId

  const [step, setStep] = useState(shouldRemoveOffChainListing ? StepperValues.CANCEL : StepperValues.SELL_MODAL)

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

  const parsedValueToConfirm = useMemo(() => parseFloat(price).toString(), [price])
  const isConfirmDisabled = parsedValueToConfirm !== confirmedInput || isCreatingOrder || isLoadingAuthorization
  const marketplaceContract = getDecentralandContract(ContractName.Marketplace, nft.chainId)
  const offChainOrdersContract = isOffchainPublicNFTOrdersEnabled
    ? getDecentralandContract(ContractName.OffChainMarketplace, nft.chainId)
    : null

  const authorizedContract = offChainOrdersContract || marketplaceContract
  const [fingerprint] = useFingerprint(nft)

  if (!wallet) {
    return null
  }

  const handleCreateOrder = useCallback(
    () => onCreateOrder(nft, parseMANANumber(price), new Date(`${expiresAt} 00:00:00`).getTime(), fingerprint),
    [expiresAt, fingerprint, nft, price, onCreateOrder]
  )

  const handleOnConfirm = useCallback(() => {
    const tokenContract = getContract({
      address: nft.contractAddress,
      network: nft.network
    })

    if (!tokenContract) {
      console.error('Token contract not found')
      return
    }

    onAuthorizedAction({
      targetContractName:
        (nft.category === NFTCategory.WEARABLE || nft.category === NFTCategory.EMOTE) && nft.network === Network.MATIC
          ? ContractName.ERC721CollectionV2
          : ContractName.ERC721,
      authorizationType: AuthorizationType.APPROVAL,
      authorizedAddress: authorizedContract.address,
      targetContract: tokenContract as unknown as Contract,
      targetContractLabel: tokenContract.name,
      authorizedContractLabel: authorizedContract.name,
      tokenId: nft.tokenId,
      onAuthorized: handleCreateOrder
    })
  }, [nft, onAuthorizedAction, getContract, handleCreateOrder, authorizedContract])

  const isInvalidDate = new Date(`${expiresAt} 00:00:00`).getTime() < Date.now()
  const isInvalidPrice = useMemo(() => parseMANANumber(price) <= 0 || parseFloat(price) !== parseMANANumber(price), [price])
  const isDisabledSell = !orderService.canSell() || !isOwnedBy(nft, wallet) || isInvalidPrice || isInvalidDate

  const handleBackOrCancel = useCallback(() => {
    if (isUpdate) {
      setStep(StepperValues.CANCEL)
    } else {
      onClose()
    }
  }, [isUpdate, setStep, onClose])

  const assetName = getAssetName(nft)

  const Stepper: {
    [key: string]: {
      navigation: React.ReactNode
      content: React.ReactNode
      description: React.ReactNode
      actions: React.ReactNode
    }
  } = {
    SELL_MODAL: {
      navigation: (
        <ModalNavigation
          title={t(isUpdate ? 'sell_page.update_title' : 'sell_page.title')}
          onClose={onClose}
          subtitle={
            <T
              id={isUpdate ? 'sell_page.update_subtitle' : 'sell_page.subtitle'}
              values={{
                name: <b className={styles.primaryText}>{assetName}</b>
              }}
            />
          }
        />
      ),
      description: null,
      content: (
        <div className={styles.fieldsContainer}>
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
      ),
      actions: (
        <Modal.Actions>
          <Button as="div" onClick={handleBackOrCancel}>
            {isUpdate ? t('cancel_sale_page.title') : t('global.cancel')}
          </Button>
          <ChainButton onClick={() => setStep(StepperValues.CONFIRM_INPUT)} primary disabled={isDisabledSell} chainId={nft.chainId}>
            {t(isUpdate ? 'sell_page.update_submit' : 'sell_page.submit')}
          </ChainButton>
        </Modal.Actions>
      )
    },
    CONFIRM_INPUT: {
      navigation: (
        <ModalNavigation
          title={t('sell_page.confirm.title')}
          onClose={isCreatingOrder ? undefined : onClose}
          onBack={isCreatingOrder ? undefined : () => setStep(StepperValues.SELL_MODAL)}
        />
      ),
      description: null,
      content: (
        <div className={styles.fieldsContainer}>
          <span>
            <T
              id="sell_page.confirm.line_one"
              values={{
                name: <b>{assetName}</b>,
                amount: (
                  <Mana showTooltip network={nft.network} inline>
                    {parseMANANumber(price).toLocaleString()}
                  </Mana>
                )
              }}
            />
          </span>

          {showPriceBelowMarketValueWarning(nft, parseMANANumber(price)) && (
            <>
              <br />
              <p className={styles.dangerText}>
                <T id="sell_page.confirm.warning" />
              </p>
            </>
          )}
          <br />
          <T id="sell_page.confirm.line_two" />

          <span>&nbsp;</span>
          <ManaField
            disabled={isCreatingOrder}
            label={t('global.price')}
            network={nft.network}
            placeholder={parsedValueToConfirm}
            value={confirmedInput}
            onChange={(_event, props) => {
              setConfirmedInput(props.value)
            }}
          />
          {error || authorizationError ? (
            <Message error size="tiny" visible content={error || authorizationError} header={t('global.error')} />
          ) : null}
        </div>
      ),
      actions: (
        <Modal.Actions>
          <Button
            disabled={isCreatingOrder}
            onClick={() => {
              setConfirmedInput('')
              onClose()
            }}
          >
            {t('global.cancel')}
          </Button>
          <Button
            type="submit"
            primary
            disabled={isConfirmDisabled}
            loading={isCreatingOrder || isLoadingAuthorization}
            onClick={handleOnConfirm}
          >
            {t('global.proceed')}
          </Button>
        </Modal.Actions>
      )
    },
    CANCEL: {
      navigation: (
        <ModalNavigation
          title={t('sell_page.confirm.title')}
          onClose={isCancelling ? undefined : onClose}
          onBack={isCancelling || shouldRemoveOffChainListing ? undefined : () => setStep(StepperValues.SELL_MODAL)}
        />
      ),
      description: null,
      content: order ? (
        shouldRemoveOffChainListing ? (
          <div className={styles.fieldsContainer}>
            <ErrorBanner info={t('sell_page.cancel_order_warning')} />
          </div>
        ) : (
          <div className={styles.fieldsContainer}>
            <span>
              <T
                id="cancel_sale_page.subtitle"
                values={{
                  name: <b>{assetName}</b>,
                  amount: (
                    <Mana showTooltip network={nft.network} inline>
                      {formatWeiMANA(order.price)}
                    </Mana>
                  )
                }}
              />
            </span>
          </div>
        )
      ) : null,
      actions: (
        <Modal.Actions>
          <Button disabled={isCancelling} onClick={onClose}>
            {t('global.cancel')}
          </Button>
          <Button
            type="submit"
            primary
            disabled={isCancelling}
            loading={isCancelling}
            onClick={() => !!order && onCancelOrder(order, nft, shouldRemoveOffChainListing)}
          >
            {t('global.proceed')}
          </Button>
        </Modal.Actions>
      )
    }
  }

  return (
    <Modal className={styles.modal} size="small" name={'SellModal'} onClose={onClose}>
      {Stepper[step].navigation}
      {Stepper[step].description}
      {Stepper[step].content}
      {Stepper[step].actions}
    </Modal>
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
