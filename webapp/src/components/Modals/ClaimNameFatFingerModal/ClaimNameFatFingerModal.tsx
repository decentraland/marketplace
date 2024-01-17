import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import WertWidget from '@wert-io/widget-initializer'
import { Env } from '@dcl/ui-env'
import { NFTCategory, Network } from '@dcl/schemas'
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
import { config } from '../../../config'
import { getContractNames } from '../../../modules/vendor'
import {
  PRICE,
  PRICE_IN_WEI,
  isEnoughClaimMana
} from '../../../modules/ens/utils'
import {
  MARKETPLACE_SERVER_URL,
  marketplaceAPI
} from '../../../modules/vendor/decentraland/marketplace/api'
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
  identity,
  metadata: { name: ENSName },
  isLoading,
  isClaimingNamesWithFiatEnabled,
  onClaim,
  onAuthorizedAction,
  onClaimNameClear,
  getContract,
  onClose,
  onClaimTxSubmitted
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

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
      : PaymentMethod.CRYPTO
  )
  const [currentName, setCurrentName] = useState('')

  const handleClaimWithCard = useCallback(async () => {
    const CONTROLLER_V2_ADDRESS = config.get(
      'CONTROLLER_V2_CONTRACT_ADDRESS',
      ''
    )

    if (wallet && identity) {
      console.log('here2')
      const signer = await getSigner()
      const factory = await DCLController__factory.connect(
        CONTROLLER_V2_ADDRESS,
        signer
      )
      console.log('here3')

      const sc_input_data = factory.interface.encodeFunctionData('register', [
        ENSName,
        wallet.address
      ])
      console.log('here4')

      const data = {
        address: wallet.address,
        commodity: isDev ? 'TTS' : 'MANA', // will be MANA later on
        commodity_amount: Number(PRICE),
        network: isDev ? 'sepolia' : 'ethereum', // will be wallet.network
        sc_address: '0x39421866645065c8d53e2d36906946f33465743d',
        sc_input_data
      }
      console.log('here5')

      if (identity) {
        console.log('here6')
        const signature = await marketplaceAPI.signWertMessage(data, identity)

        const signedData = {
          ...data,
          signature
        }

        console.log('here7')

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

        const wertWidget = new WertWidget({
          ...signedData,
          ...{
            partner_id: '01HGFWXR5CQMYHYSR9KVTKWDT5', // your partner id
            origin: config.is(Env.DEVELOPMENT)
              ? 'https://sandbox.wert.io'
              : 'https://widget.wert.io',
            lang: 'en',
            click_id: uuidv4(), // unique id of purchase in your system
            widgetLayoutMode: 'Modal'
          },
          ...nftOptions,
          listeners: {
            'payment-status': options => {
              console.log('options: ', options)
              if (options.tx_id) {
                onClaimTxSubmitted(
                  ENSName,
                  wallet.address,
                  wallet.chainId,
                  options.tx_id
                )
              }
            }
          }
        })

        wertWidget.open()
      }
    }
  }, [wallet, identity, ENSName, onClaimTxSubmitted])

  const handleClaim = useCallback(() => {
    if (paymentMethod === PaymentMethod.FIAT) {
      handleClaimWithCard()
    } else {
      const mana = getContract({
        name: getContractNames().MANA,
        network: Network.ETHEREUM
      })

      if (!mana) return

      const manaContract = {
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
      <Form onSubmit={handleClaim}>
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
                          paymentMethod === PaymentMethod.CRYPTO && 'selected',
                          'paymentMethod'
                        )}
                        onClick={() =>
                          canClaimWithCrypto &&
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
                        onClick={() =>
                          isClaimingNamesWithFiatEnabled
                            ? setPaymentMethod(PaymentMethod.FIAT)
                            : null
                        }
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
        </Modal.Content>
        <Modal.Actions>
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
                  loading={isLoading}
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
        </Modal.Actions>
      </Form>
    </Modal>
  )
}

export default ClaimNameFatFingerModal
