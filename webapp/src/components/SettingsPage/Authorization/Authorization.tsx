import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { TransactionLink } from 'decentraland-dapps/dist/containers'
import {
  GrantTokenRequestAction,
  GRANT_TOKEN_REQUEST,
  RevokeTokenRequestAction,
  REVOKE_TOKEN_REQUEST
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { getChainConfiguration } from 'decentraland-dapps/dist/lib/chainConfiguration'
import { areEqual } from 'decentraland-dapps/dist/modules/authorization/utils'
import { Form, Radio, Loader, Popup, RadioProps } from 'decentraland-ui'
import { locations } from '../../../modules/routing/locations'
import { hasTransactionPending } from '../../../modules/transaction/utils'
import { getContract } from '../../../modules/contract/utils'
import { isAuthorized } from './utils'
import { Props } from './Authorization.types'
import './Authorization.css'

const Authorization = (props: Props) => {
  const {
    authorization,
    authorizations,
    loading,
    pendingTransactions,
    onGrant,
    onRevoke
  } = props

  const handleOnChange = useCallback(
    (isChecked: boolean) =>
      isChecked ? onGrant(authorization) : onRevoke(authorization),
    [authorization, onGrant, onRevoke]
  )

  const { contractAddress, authorizedAddress } = authorization
  const isLoading =
    loading.some(action => {
      if (
        action.type === GRANT_TOKEN_REQUEST ||
        action.type === REVOKE_TOKEN_REQUEST
      ) {
        const { payload } = action as
          | GrantTokenRequestAction
          | RevokeTokenRequestAction
        return areEqual(authorization, payload.authorization)
      }
    }) ||
    hasTransactionPending(
      pendingTransactions,
      authorizedAddress,
      contractAddress
    )

  const contract = getContract({ address: authorizedAddress })
  const token = getContract({ address: contractAddress })

  const { network } = getChainConfiguration(token.chainId)

  return (
    <div className="Authorization">
      <Form.Field
        key={contractAddress}
        className={isLoading ? 'is-pending' : ''}
      >
        <Popup
          content={t('settings_page.pending_tx')}
          position="top left"
          trigger={
            <Link to={locations.activity()} className="loader-tooltip">
              <Loader active size="mini" />
            </Link>
          }
        />
        <Radio
          checked={isAuthorized(authorization, authorizations)}
          label={token.name}
          onClick={(_, props: RadioProps) => handleOnChange(!!props.checked)}
        />
        <div className="radio-description secondary-text">
          <T
            id="authorization.authorize"
            values={{
              contract_link: (
                <TransactionLink address={authorizedAddress} txHash="">
                  {contract.name}
                </TransactionLink>
              ),
              symbol: token.name,
              network: t(`networks.${network.toLowerCase()}`)
            }}
          />
        </div>
      </Form.Field>
    </div>
  )
}

export default React.memo(Authorization)
