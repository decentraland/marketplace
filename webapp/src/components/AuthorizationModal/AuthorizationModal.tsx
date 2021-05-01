import React from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { contractNames, contractSymbols } from '../../modules/contract/utils'
import { locations } from '../../modules/routing/locations'
import { isAuthorized } from '../SettingsPage/Authorization/utils'
import { Authorization } from '../SettingsPage/Authorization'
import { Props } from './AuthorizationModal.types'

const AuthorizationModal = (props: Props) => {
  const {
    open,
    authorization,
    authorizations,
    pendingTransactions,
    onGrant,
    onRevoke,
    onCancel,
    onProceed
  } = props

  return (
    <Modal open={open} size="small" className="AuthorizationModal">
      <Modal.Header>
        {t('authorization_modal.title', {
          token: contractSymbols[authorization.tokenAddress]
        })}
      </Modal.Header>
      <Modal.Description>
        <T
          id="authorization_modal.description"
          values={{
            contract: contractNames[authorization.authorizedAddress],
            token: contractSymbols[authorization.tokenAddress],
            settings_link: (
              <Link to={locations.settings()}>{t('global.settings')}</Link>
            ),
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
          key={authorization.authorizedAddress}
          authorization={authorization}
          authorizations={authorizations}
          pendingTransactions={pendingTransactions}
          onGrant={onGrant}
          onRevoke={onRevoke}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onCancel}>{t('global.cancel')}</Button>
        <Button
          disabled={!isAuthorized(authorization, authorizations)}
          primary
          onClick={onProceed}
        >
          {t('global.proceed')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(AuthorizationModal)
