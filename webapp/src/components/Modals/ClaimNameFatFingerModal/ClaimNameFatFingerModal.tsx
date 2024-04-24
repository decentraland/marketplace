import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ChainId, NFTCategory } from '@dcl/schemas'
import { Env } from '@dcl/ui-env'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { FiatGateway } from 'decentraland-dapps/dist/modules/gateway/types'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { ModalNavigation, Field, Icon } from 'decentraland-ui'
import { config } from '../../../config'
import { DCLController__factory } from '../../../contracts/factories/DCLController__factory'
import { Asset } from '../../../modules/asset/types'
import { PRICE } from '../../../modules/ens/utils'
import * as events from '../../../utils/events'
import { drawImage } from '../../AssetImage/EnsImage/utils'
import { BuyWithCardButton } from '../../AssetPage/SaleActionBox/BuyNFTButtons/BuyWithCardButton'
import { BuyWithCryptoButton } from '../../AssetPage/SaleActionBox/BuyNFTButtons/BuyWithCryptoButton'
import { Props } from './ClaimNameFatFingerModal.types'
import './ClaimNameFatFingerModal.css'

export const CONTROLLER_V2_ADDRESS = config.get('CONTROLLER_V2_CONTRACT_ADDRESS', '')

export const CRYPTO_PAYMENT_METHOD_DATA_TESTID = 'crypto-payment-method'
export const FIAT_PAYMENT_METHOD_DATA_TESTID = 'fiat-payment-method'

const isDev = config.is(Env.DEVELOPMENT)

const ClaimNameFatFingerModal = ({
  name: modalName,
  wallet,
  metadata: { name: ENSName, autoComplete },
  isClaimingName,
  onBuyWithCrypto,
  onClose,
  onClaimTxSubmitted,
  onOpenFiatGateway
}: Props) => {
  const analytics = getAnalytics()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoadingFIATWidget, setIsLoadingFIATWidget] = useState(false)
  const isLoading = isClaimingName || isLoadingFIATWidget

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const [currentName, setCurrentName] = useState(autoComplete ? ENSName : '')

  const handleClaimWithCard = useCallback(async () => {
    analytics.track(events.CLICK_CHECKOUT_NAME, {
      name: ENSName,
      payment_method: 'fiat'
    })
    setIsLoadingFIATWidget(true)
    const wertURL = config.get('WERT_URL')
    if (wallet) {
      const signer = await getSigner()
      const factory = DCLController__factory.connect(CONTROLLER_V2_ADDRESS, signer)

      const sc_input_data = factory.interface.encodeFunctionData('register', [ENSName, wallet.address])

      // Generate the image that will be loaded by the Wert modal
      const temporaryCanvas = document.createElement('canvas')
      temporaryCanvas.width = 330
      temporaryCanvas.height = 330
      await drawImage(temporaryCanvas, ENSName, 330, 330)
      const dataUrl = temporaryCanvas.toDataURL()

      const data = {
        address: wallet.address,
        commodity: isDev ? 'TTS' : 'MANA',
        commodity_amount: Number(PRICE),
        sc_address: config.get(isDev ? 'CONTROLLER_V2_CONTRACT_ADDRESS_FIAT' : 'CONTROLLER_V2_CONTRACT_ADDRESS'),
        sc_input_data
      }

      const nftOptions = {
        extra: {
          item_info: {
            category: 'Decentraland NAME',
            author: 'Decentraland',
            image_url: dataUrl,
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
              onClaimTxSubmitted(ENSName, wallet.address, isDev ? ChainId.ETHEREUM_SEPOLIA : ChainId.ETHEREUM_MAINNET, options.data.tx_id)
            }
          },
          onSuccess: options => {
            if ('data' in options && 'tx_id' in options.data) {
              analytics.track(events.BUY_NAME_SUCCESS, {
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

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setCurrentName(name.replace(/\s/g, ''))
  }

  const handleOnBuyWithCrypto = useCallback(() => {
    analytics.track(events.CLICK_CHECKOUT_NAME, {
      name: ENSName,
      payment_method: 'crypto'
    })

    onBuyWithCrypto(currentName)
  }, [currentName])

  const areNamesDifferent = currentName !== ENSName
  const hasError = areNamesDifferent && currentName.length > 0

  return (
    <Modal name={modalName} onClose={isLoading ? undefined : onClose}>
      <ModalNavigation title={t('names_page.claim_name_fat_finger_modal.title')} onClose={isLoading ? undefined : onClose} />
      <Modal.Content>
        <div className="details">
          <T id="names_page.claim_name_fat_finger_modal.description" values={{ name: <strong>{ENSName}</strong>, br: <br /> }} />
        </div>
        <Field
          placeholder={t('names_page.claim_name_fat_finger_modal.name_placeholder')}
          value={currentName}
          error={hasError}
          disabled={isLoading}
          message={hasError ? t('names_page.claim_name_fat_finger_modal.names_different') : ''}
          children={<input ref={inputRef} value={currentName} onChange={handleChangeName} />}
        />
        <div className="capsWarning">
          <Icon name="info circle" />
          {t('names_page.claim_name_fat_finger_modal.caps_warning')}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <BuyWithCryptoButton
          asset={{ category: NFTCategory.ENS } as Asset}
          data-testid={CRYPTO_PAYMENT_METHOD_DATA_TESTID}
          onClick={handleOnBuyWithCrypto}
          disabled={isLoading || areNamesDifferent}
        />
        <BuyWithCardButton
          data-testid={FIAT_PAYMENT_METHOD_DATA_TESTID}
          onClick={handleClaimWithCard}
          disabled={isLoading || isLoadingFIATWidget || areNamesDifferent}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ClaimNameFatFingerModal
