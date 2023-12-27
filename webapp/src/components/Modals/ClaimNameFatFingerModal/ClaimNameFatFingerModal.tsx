import React, { useCallback, useState } from 'react'
import { NFTCategory, Network } from '@dcl/schemas'
import { ModalNavigation, Field, Button, Form, Icon } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib/eth'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { config } from '../../../config'
import { getContractNames } from '../../../modules/vendor'
import { PRICE_IN_WEI } from '../../../modules/ens/utils'
import { Props } from './ClaimNameFatFingerModal.types'
import './ClaimNameFatFingerModal.css'

export const CONTROLLER_V2_ADDRESS = config.get(
  'CONTROLLER_V2_CONTRACT_ADDRESS',
  ''
)

const ClaimNameFatFingerModal = ({
  name,
  metadata: { name: originalName },
  isLoading,
  onClaim,
  onAuthorizedAction,
  onClaimNameClear,
  getContract,
  onClose
}: Props) => {
  const [currentName, setCurrentName] = useState('')

  const handleClaim = useCallback(() => {
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
  }, [currentName, getContract, onAuthorizedAction, onClaim, onClaimNameClear])

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    setCurrentName(name.replace(/\s/g, ''))
  }

  const areNamesDifferent = currentName !== originalName
  const hasError = areNamesDifferent && currentName.length > 0

  return (
    <Modal name={name} onClose={isLoading ? undefined : onClose}>
      <ModalNavigation
        title={t('names_page.claim_name_fat_finger_modal.title')}
        onClose={isLoading ? undefined : onClose}
      />
      <Form onSubmit={handleClaim}>
        <Modal.Content>
          <div className="details">
            <T
              id="names_page.claim_name_fat_finger_modal.description"
              values={{ name: <strong>{originalName}</strong> }}
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
