import React from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { isAuthorized } from '../SettingsPage/Authorization/utils'
import { Authorization } from '../SettingsPage/Authorization'
import { Props } from './AuthorizationModal.types'

const AuthorizationModal = (props: Props) => {
  const {
    open,
    authorization,
    authorizations,
    isLoading,
    isAuthorizing,
    getContract,
    onCancel,
    onProceed
  } = props

  const contract = getContract({
    address: authorization.authorizedAddress
  })
  const token = getContract({
    address: authorization.contractAddress
  })

  if (!contract || !token) {
    return null
  }

  return (
    <Modal open={open} size="small" className="AuthorizationModal">
      <Modal.Header>
        {t('authorization_modal.title', {
          token: token.name
        })}
      </Modal.Header>
      <Modal.Description>
        <T
          id="authorization_modal.description"
          values={{
            contract: contract.name,
            token: token.name,
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
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onCancel}>{t('global.cancel')}</Button>
        <Button
          primary
          loading={isLoading}
          disabled={
            isLoading ||
            isAuthorizing ||
            !isAuthorized(authorization, authorizations)
          }
          onClick={onProceed}
        >
          {t('global.proceed')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(AuthorizationModal)
