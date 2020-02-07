import React from 'react'
import { Props, AuthorizationType } from './AuthorizationModal.types'
import { Modal, Button } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { contractSymbols } from '../../modules/contract/utils'
import { Authorization } from '../SettingsPage/Authorization'
import { hasAuthorization } from '../../modules/authorization/utils'

const AuthorizationModal = (props: Props) => {
  const {
    open,
    contractAddress,
    tokenAddress,
    type,
    onAllow,
    onApprove,
    onCancel,
    onProceed,
    pendingTransactions
  } = props

  const isAuthorized = hasAuthorization(contractAddress, tokenAddress, type)

  return (
    <Modal open={open} size="small" className="AuthorizationModal">
      <Modal.Header>
        {t('authorization_modal.title', {
          token: contractSymbols[tokenAddress]
        })}
      </Modal.Header>
      <Modal.Description>
        <T
          id="authorization_modal.description"
          values={{
            contract: contractSymbols[contractAddress],
            token: contractSymbols[tokenAddress],
            br: (
              <>
                <br />
                <br />
              </>
            )
          }}
        />
      </Modal.Description>
      <Modal.Content>
        <Authorization
          key={contractAddress}
          checked={isAuthorized}
          contractAddress={contractAddress}
          tokenContractAddress={tokenAddress}
          pendingTransactions={pendingTransactions}
          onChange={type === AuthorizationType.ALLOWANCE ? onAllow : onApprove}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onCancel}>{t('global.cancel')}</Button>
        <Button disabled={!isAuthorized} primary onClick={onProceed}>
          {t('global.proceed')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(AuthorizationModal)
