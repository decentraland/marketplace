import React, { useCallback, useState } from 'react'
import classNames from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import WertWidget from '@wert-io/widget-initializer'
import { Env } from '@dcl/ui-env'
import { NFTCategory, Network } from '@dcl/schemas'
import { ModalNavigation, Field, Button, Form, Icon } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'
import { getChainIdByNetwork, getSigner } from 'decentraland-dapps/dist/lib/eth'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { config } from '../../../config'
import { getContractNames } from '../../../modules/vendor'
import { PRICE, PRICE_IN_WEI } from '../../../modules/ens/utils'
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

const isDev = config.is(Env.DEVELOPMENT)

enum PaymentMethod {
  CRYPTO,
  FIAT
}

const ClaimNameFatFingerModal = ({
  name: modalName,
  wallet,
  identity,
  metadata: { name: ENSName },
  isLoading,
  onClaim,
  onAuthorizedAction,
  onClaimNameClear,
  getContract,
  onClose,
  onClaimTxSubmitted
}: Props) => {
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CRYPTO)
  const [currentName, setCurrentName] = useState('')

  const handleClaimWithCard = useCallback(async () => {
    const CONTROLLER_V2_ADDRESS = config.get(
      'CONTROLLER_V2_CONTRACT_ADDRESS',
      ''
    )

    if (wallet && identity) {
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
        commodity: isDev ? 'TTS' : 'MANA', // will be MANA later on
        commodity_amount: Number(PRICE),
        network: isDev ? 'sepolia' : 'ethereum', // will be wallet.network
        sc_address: CONTROLLER_V2_ADDRESS,
        sc_input_data
      }

      if (identity) {
        const signature = await marketplaceAPI.signWertMessage(data, identity)

        const signedData = {
          ...data,
          signature
        }

        const nftOptions = {
          extra: {
            item_info: {
              // category: 'Claim Decentraland NAME',
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
              if (options.tx_id) {
                onClaimTxSubmitted(
                  ENSName,
                  wallet.address,
                  wallet.chainId,
                  options.tx_id
                )
              }
              console.log('options: ', options)
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
              values={{ name: <strong>{ENSName}</strong> }}
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
            onChange={handleChangeName}
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
                <div
                  className={classNames(
                    'baseGradient',
                    paymentMethod === PaymentMethod.CRYPTO && 'gradient'
                  )}
                >
                  <div
                    className={classNames(
                      paymentMethod === PaymentMethod.CRYPTO && 'selected',
                      'paymentMethod'
                    )}
                    onClick={() => setPaymentMethod(PaymentMethod.CRYPTO)}
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
                <div
                  className={classNames(
                    'baseGradient',
                    paymentMethod === PaymentMethod.FIAT && 'gradient'
                  )}
                >
                  <div
                    className={classNames(
                      paymentMethod === PaymentMethod.FIAT && 'selected',
                      'paymentMethod'
                    )}
                    onClick={() => setPaymentMethod(PaymentMethod.FIAT)}
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
          <Button
            primary
            type="submit"
            disabled={areNamesDifferent || isLoading}
            loading={isLoading}
          >
            {t('global.confirm')}
          </Button>
        </Modal.Actions>
      </Form>
    </Modal>
  )
}

export default ClaimNameFatFingerModal
