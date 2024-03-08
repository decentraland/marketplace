import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Field, Loader, Mana, Message, ModalNavigation } from 'decentraland-ui'
import { Network, NFTCategory } from '@dcl/schemas'
import { ethers } from 'ethers'
import addDays from 'date-fns/addDays'
import formatDate from 'date-fns/format'
import isValid from 'date-fns/isValid'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { ContractName } from 'decentraland-transactions'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AuthorizationType, Authorization as Authorizations } from 'decentraland-dapps/dist/modules/authorization/types'
import { ChainButton, Modal } from 'decentraland-dapps/dist/containers'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'

import { getContractNames, VendorFactory } from '../../../modules/vendor'
import { getAssetName, isOwnedBy } from '../../../modules/asset/utils'
import { getDefaultExpirationDate, INPUT_FORMAT } from '../../../modules/order/utils'
import { ManaField } from '../../ManaField'
import { formatWeiMANA, parseMANANumber } from '../../../lib/mana'
import { locations } from '../../../modules/routing/locations'
import { useAuthorization } from '../../../lib/authorization'
import { showPriceBelowMarketValueWarning } from '../../SellPage/SellModal/utils'
import { Authorization } from '../../SettingsPage/Authorization'
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
  isCreatingOrder,
  authorizations,
  isAuthorizing,
  error,
  onFetchAuthorizations,
  isCancelling,
  onCancelOrder
}: Props) => {
  const { orderService } = VendorFactory.build(nft.vendor)

  const [confirmedInput, setConfirmedInput] = useState<string>('')

  const [step, setStep] = useState(StepperValues.SELL_MODAL)

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

  const parsedValueToConfirm = parseFloat(price).toString()

  const isConfirmDisabled = parsedValueToConfirm !== confirmedInput || isCreatingOrder

  const contractNames = getContractNames()

  const marketplace = getContract({
    name: contractNames.MARKETPLACE,
    network: nft.network
  })

  const authorization: Authorizations = {
    address: wallet?.address || '',
    authorizedAddress: marketplace!.address,
    contractAddress: nft.contractAddress,
    contractName:
      (nft.category === NFTCategory.WEARABLE || nft.category === NFTCategory.EMOTE) && nft.network === Network.MATIC
        ? ContractName.ERC721CollectionV2
        : ContractName.ERC721,
    chainId: nft.chainId,
    type: AuthorizationType.APPROVAL
  }

  const [isLoadingAuthorizations, isAuthorized] = useAuthorization(authorization, onFetchAuthorizations)

  if (!wallet) {
    return null
  }

  const contract = getContract({
    address: authorization.authorizedAddress
  })

  const token = getContract({
    address: authorization.contractAddress
  })

  const handleOnConfirm = () => {
    if (hasAuthorization(authorizations, authorization)) {
      handleCreateOrder()
    } else {
      setStep(StepperValues.AUTHORIZE)
    }
  }

  const handleCreateOrder = () => onCreateOrder(nft, parseMANANumber(price), new Date(`${expiresAt} 00:00:00`).getTime())

  const isInvalidDate = new Date(`${expiresAt} 00:00:00`).getTime() < Date.now()
  const isInvalidPrice = parseMANANumber(price) <= 0 || parseFloat(price) !== parseMANANumber(price)
  const isDisabledSell = !orderService.canSell() || !isOwnedBy(nft, wallet) || isInvalidPrice || isInvalidDate

  const handleBackOrCancel = () => {
    if (isUpdate) {
      setStep(StepperValues.CANCEL)
    } else {
      onClose()
    }
  }

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
                name: <b className={styles.primaryText}>{getAssetName(nft)}</b>
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
      content: isLoadingAuthorizations ? (
        <div className={styles.loaderContainer}>
          <Loader active size="large" />
        </div>
      ) : (
        <div className={styles.fieldsContainer}>
          <span>
            <T
              id="sell_page.confirm.line_one"
              values={{
                name: <b>{getAssetName(nft)}</b>,
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
          {error && <Message error size="tiny" visible content={error} header={t('global.error')} />}
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
          <Button type="submit" primary disabled={isConfirmDisabled} loading={isCreatingOrder} onClick={handleOnConfirm}>
            {t('global.proceed')}
          </Button>
        </Modal.Actions>
      )
    },
    AUTHORIZE: {
      navigation: (
        <ModalNavigation
          title={t('authorization_modal.title', {
            token: token?.name
          })}
          onClose={isAuthorizing || isCreatingOrder ? undefined : onClose}
        />
      ),
      description: (
        <Modal.Description>
          <T
            id="authorization_modal.description"
            values={{
              contract: contract?.name,
              token: token?.name,
              settings_link: <Link to={locations.settings()}>{t('global.settings')}</Link>,
              br: (
                <>
                  <br />
                  <br />
                </>
              )
            }}
          />
        </Modal.Description>
      ),
      content: <Authorization key={authorization.authorizedAddress} authorization={authorization} />,
      actions: (
        <Modal.Actions className={styles.AuthorizationModalActions}>
          <Button onClick={onClose} className={styles.AuthorizationModalButtons} disabled={isAuthorizing || isCreatingOrder}>
            {t('global.cancel')}
          </Button>
          <Button
            className={styles.AuthorizationModalButtons}
            primary
            loading={isCreatingOrder || isAuthorizing}
            disabled={isCreatingOrder || isAuthorizing || !isAuthorized}
            onClick={handleCreateOrder}
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
          onClose={onClose}
          onBack={isCancelling ? undefined : () => setStep(StepperValues.SELL_MODAL)}
        />
      ),
      description: null,
      content: order ? (
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
      ) : null,
      actions: (
        <Modal.Actions>
          <Button disabled={isCancelling} onClick={onClose}>
            {t('global.cancel')}
          </Button>
          <Button type="submit" primary disabled={isCancelling} loading={isCancelling} onClick={() => onCancelOrder(order!, nft)}>
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

export default React.memo(SellModal)
