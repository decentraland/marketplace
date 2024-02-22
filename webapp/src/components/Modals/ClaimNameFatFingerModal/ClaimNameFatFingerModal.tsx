import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import { FiatGateway } from 'decentraland-dapps/dist/modules/gateway/types'
import { Env } from '@dcl/ui-env'
import { ChainId, Contract, NFTCategory, Network } from '@dcl/schemas'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import {
  ModalNavigation,
  Field,
  Button,
  Form,
  Icon,
  Popup
} from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'
import { getChainIdByNetwork, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { BuyWithCryptoButton } from '../../AssetPage/SaleActionBox/BuyNFTButtons/BuyWithCryptoButton'
import { BuyWithCardButton } from '../../AssetPage/SaleActionBox/BuyNFTButtons/BuyWithCardButton'
import { config } from '../../../config'
import { getContractNames } from '../../../modules/vendor'
import {
  PRICE,
  PRICE_IN_WEI,
  isEnoughClaimMana
} from '../../../modules/ens/utils'
import { MARKETPLACE_SERVER_URL } from '../../../modules/vendor/decentraland/marketplace/api'
import { DCLController__factory } from '../../../contracts/factories/DCLController__factory'
import { Mana } from '../../Mana'
import { Props } from './ClaimNameFatFingerModal.types'
import './ClaimNameFatFingerModal.css'

export const CONTROLLER_V2_ADDRESS = config.get(
  'CONTROLLER_V2_CONTRACT_ADDRESS',
  ''
)

export const CRYPTO_PAYMENT_METHOD_DATA_TESTID = 'crypto-payment-method'
export const FIAT_PAYMENT_METHOD_DATA_TESTID = 'fiat-payment-method'

const isDev = config.is(Env.DEVELOPMENT)

enum PaymentMethod {
  CRYPTO,
  FIAT
}

const ClaimNameFatFingerModal = ({
  name: modalName,
  wallet,
  currentMana,
  metadata: { name: ENSName, autoComplete },
  isLoading: isClaiming,
  isClaimingNamesWithFiatEnabled,
  isClaimingNamesCrossChainEnabled,
  onClaim,
  onBuyWithCrypto,
  onAuthorizedAction,
  onClaimNameClear,
  getContract,
  onClose,
  onClaimTxSubmitted,
  onOpenFiatGateway
}: Props) => {
  const analytics = useMemo(() => getAnalytics(), [])
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoadingFIATWidget, setIsLoadingFIATWidget] = useState(false)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const [paymentMethod, setPaymentMethod] = useState(
    !!(wallet && currentMana && isEnoughClaimMana(currentMana))
      ? PaymentMethod.CRYPTO
      : isClaimingNamesWithFiatEnabled
      ? PaymentMethod.FIAT
      : undefined
  )
  const [currentName, setCurrentName] = useState(autoComplete ? ENSName : '')

  const handleClaimWithCard = useCallback(async () => {
    setIsLoadingFIATWidget(true)
    const wertURL = config.get('WERT_URL')
    if (wallet) {
      const signer = await getSigner()
      const factory = await DCLController__factory.connect(
        CONTROLLER_V2_ADDRESS,
        signer
      )

      const sc_input_data = factory.interface.encodeFunctionData('register', [
        ENSName,
        wallet.address
      ])

      const data = {
        address: wallet.address,
        commodity: isDev ? 'TTS' : 'MANA',
        commodity_amount: Number(PRICE),
        sc_address: config.get(
          isDev && wallet.chainId === ChainId.ETHEREUM_SEPOLIA
            ? 'CONTROLLER_V2_CONTRACT_ADDRESS_FIAT'
            : 'CONTROLLER_V2_CONTRACT_ADDRESS'
        ),
        sc_input_data
      }

      const nftOptions = {
        extra: {
          item_info: {
            category: 'Decentraland NAME',
            author: 'Decentraland',
            image_url: `${MARKETPLACE_SERVER_URL}/ens/generate?ens=${ENSName}&width=330&height=330`,
            ENSName,
            seller: 'DCL Names'
          }
        }
      }

      onOpenFiatGateway(
        FiatGateway.WERT,
        {
          ...data,
          ...nftOptions,
          partner_id: config.get('WERT_PARTNER_ID'),
          origin: wertURL,
          lang: 'en',
          click_id: uuidv4() // unique id of purchase in your system
        },
        {
          onLoaded: () => {
            setIsLoadingFIATWidget(false)
          },
          onPending: options => {
            if ('data' in options && 'tx_id' in options.data) {
              onClaimTxSubmitted(
                ENSName,
                wallet.address,
                wallet.chainId,
                options.data.tx_id as string
              )
            }
          },
          onSuccess: options => {
            if ('data' in options && 'tx_id' in options.data) {
              analytics.track('Buy Name Success', {
                name: ENSName,
                payment_method: 'fiat',
                txHash: options.data.tx_id
              })
            }
          }
        }
      )
    }
  }, [wallet, ENSName, analytics, onOpenFiatGateway, onClaimTxSubmitted])

  const isLoading = useMemo(() => isClaiming || isLoadingFIATWidget, [
    isClaiming,
    isLoadingFIATWidget
  ])

  const handleClaimWithCardClick = useCallback(() => {
    return isClaimingNamesWithFiatEnabled && !isLoading
      ? setPaymentMethod(PaymentMethod.FIAT)
      : null
  }, [isLoading, isClaimingNamesWithFiatEnabled])

  const handleClaim = useCallback(() => {
    analytics.track('Click checkout name', {
      name: ENSName,
      payment_method: paymentMethod === PaymentMethod.CRYPTO ? 'crypto' : 'fiat'
    })
    if (paymentMethod === PaymentMethod.FIAT) {
      setIsLoadingFIATWidget(true)
      handleClaimWithCard()
    } else {
      const mana = getContract({
        name: getContractNames().MANA,
        network: Network.ETHEREUM
      })

      if (!mana) return

      const manaContract: Contract = {
        name: ContractName.MANAToken,
        address: mana.address,
        chainId: getChainIdByNetwork(Network.ETHEREUM),
        network: Network.ETHEREUM,
        category: NFTCategory.ENS
      }

      onClaimNameClear()
      onAuthorizedAction({
        authorizedAddress: CONTROLLER_V2_ADDRESS,
        authorizedContractLabel: 'DCLControllerV2',
        targetContract: manaContract,
        targetContractName: ContractName.MANAToken,
        requiredAllowanceInWei: PRICE_IN_WEI,
        authorizationType: AuthorizationType.ALLOWANCE,
        onAuthorized: () => onClaim(currentName)
      })
    }
  }, [
    ENSName,
    analytics,
    currentName,
    getContract,
    handleClaimWithCard,
    onAuthorizedAction,
    onClaim,
    onClaimNameClear,
    paymentMethod
  ])

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setCurrentName(name.replace(/\s/g, ''))
  }

  const handleOnBuyWithCrypto = useCallback(() => {
    onBuyWithCrypto(currentName)
  }, [currentName])

  const areNamesDifferent = currentName !== ENSName
  const hasError = areNamesDifferent && currentName.length > 0

  const canClaimWithCrypto = useMemo(
    () => !!(wallet && currentMana && isEnoughClaimMana(currentMana)),
    [currentMana, wallet]
  )

  return (
    <Modal name={modalName} onClose={isLoading ? undefined : onClose}>
      <ModalNavigation
        title={t('names_page.claim_name_fat_finger_modal.title')}
        onClose={isLoading ? undefined : onClose}
      />
      <Form
        onSubmit={!isClaimingNamesCrossChainEnabled ? handleClaim : undefined}
      >
        <Modal.Content>
          <div className="details">
            <T
              id="names_page.claim_name_fat_finger_modal.description"
              values={{ name: <strong>{ENSName}</strong>, br: <br /> }}
            />
          </div>
          <Field
            placeholder={t(
              'names_page.claim_name_fat_finger_modal.name_placeholder'
            )}
            value={currentName}
            error={hasError}
            disabled={isLoading}
            message={
              hasError
                ? t('names_page.claim_name_fat_finger_modal.names_different')
                : ''
            }
            children={
              <input
                ref={inputRef}
                value={currentName}
                onChange={handleChangeName}
              />
            }
          />
          <div className="capsWarning ">
            <Icon name="info circle" />
            {t('names_page.claim_name_fat_finger_modal.caps_warning')}
          </div>
          {!isClaimingNamesCrossChainEnabled ? (
            <div>
              <span className="payWith payWithTitle">
                {t('names_page.claim_name_fat_finger_modal.paying_with')}
              </span>
              <div>
                <div className="paymentMethodContainer">
                  <span className="payWithTitle">
                    {t(
                      'names_page.claim_name_fat_finger_modal.pay_methods.crypto.name'
                    )}
                  </span>
                  <Popup
                    style={{ zIndex: 9999999 }}
                    className="modalTooltip"
                    content={t('names_page.not_enough_mana')}
                    position="top center"
                    trigger={
                      <div
                        data-testid={CRYPTO_PAYMENT_METHOD_DATA_TESTID}
                        className={classNames(
                          'baseGradient',
                          !canClaimWithCrypto && 'disabled',
                          paymentMethod === PaymentMethod.CRYPTO && 'gradient'
                        )}
                      >
                        <div
                          className={classNames(
                            paymentMethod === PaymentMethod.CRYPTO &&
                              'selected',
                            'paymentMethod'
                          )}
                          onClick={() =>
                            canClaimWithCrypto &&
                            !isLoading &&
                            setPaymentMethod(PaymentMethod.CRYPTO)
                          }
                        >
                          <Mana />
                          <div>
                            <span>100 MANA</span>
                            <span>
                              {t(
                                'names_page.claim_name_fat_finger_modal.pay_methods.crypto.subtitle'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                    disabled={!!(wallet && canClaimWithCrypto)}
                    hideOnScroll
                    on="hover"
                    inverted
                  />
                </div>
                <div className="paymentMethodContainer">
                  <span className="payWithTitle">
                    {t(
                      'names_page.claim_name_fat_finger_modal.pay_methods.fiat.name'
                    )}
                  </span>
                  <span className="newPaymentMethod">
                    {t(
                      'names_page.claim_name_fat_finger_modal.pay_methods.fiat.new'
                    )}
                  </span>
                  <Popup
                    style={{ zIndex: 9999999 }}
                    className="modalTooltip"
                    content={t('names_page.fiat_payments_not_enabled')}
                    position="top center"
                    trigger={
                      <div
                        className={classNames(
                          'baseGradient',
                          paymentMethod === PaymentMethod.FIAT && 'gradient',
                          !isClaimingNamesWithFiatEnabled && 'disabled'
                        )}
                      >
                        <div
                          data-testid={FIAT_PAYMENT_METHOD_DATA_TESTID}
                          className={classNames(
                            paymentMethod === PaymentMethod.FIAT && 'selected',
                            'paymentMethod'
                          )}
                          onClick={handleClaimWithCardClick}
                        >
                          <Icon name="credit card outline" />
                          <div>
                            <span>
                              {t(
                                'names_page.claim_name_fat_finger_modal.pay_methods.fiat.title'
                              )}
                            </span>
                            <span>
                              {t(
                                'names_page.claim_name_fat_finger_modal.pay_methods.fiat.subtitle'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                    disabled={isClaimingNamesWithFiatEnabled}
                    hideOnScroll
                    on="hover"
                    inverted
                  />
                </div>
              </div>
            </div>
          ) : null}
        </Modal.Content>
        <Modal.Actions
          className={classNames(
            isClaimingNamesCrossChainEnabled && 'modalActions'
          )}
        >
          {isClaimingNamesCrossChainEnabled ? (
            <>
              <BuyWithCryptoButton
                assetNetwork={Network.ETHEREUM}
                onClick={handleOnBuyWithCrypto}
                disabled={isLoading || areNamesDifferent}
              />
              <BuyWithCardButton
                onClick={handleClaimWithCard}
                disabled={isLoading || isLoadingFIATWidget || areNamesDifferent}
              />
            </>
          ) : (
            <>
              <Button
                secondary
                onClick={onClose}
                disabled={isLoading}
                type="button"
              >
                {t('global.cancel')}
              </Button>
              <Popup
                style={{ zIndex: 9999999 }}
                className="modalTooltip"
                content={t('names_page.not_enough_mana')}
                position="top center"
                trigger={
                  <div className="popupButton">
                    <Button
                      primary
                      type="submit"
                      disabled={
                        areNamesDifferent ||
                        isLoading ||
                        (paymentMethod === PaymentMethod.CRYPTO &&
                          !canClaimWithCrypto)
                      }
                      loading={isLoading || isLoadingFIATWidget}
                    >
                      {t('global.confirm')}
                    </Button>
                  </div>
                }
                disabled={
                  !!(wallet && canClaimWithCrypto) ||
                  paymentMethod === PaymentMethod.FIAT
                }
                hideOnScroll={true}
                on="hover"
                inverted
              />
            </>
          )}
        </Modal.Actions>
      </Form>
    </Modal>
  )
}

export default ClaimNameFatFingerModal
