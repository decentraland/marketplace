import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Network } from '@dcl/schemas'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { ChainCheck, TransactionLink } from 'decentraland-dapps/dist/containers'
import { getChainConfiguration } from 'decentraland-dapps/dist/lib/chainConfiguration'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Form, Radio, Loader, Popup, RadioProps } from 'decentraland-ui'
import { isAuthorized } from '../../../lib/authorization'
import { locations } from '../../../modules/routing/locations'
import { Props } from './Authorization.types'
import './Authorization.css'

const Authorization = (props: Props) => {
  const { authorization, authorizations, shouldUpdateSpendingCap, isLoading, onGrant, onRevoke, getContract } = props

  const handleOnChange = useCallback(
    (isChecked: boolean) => {
      if (isChecked) {
        if (
          getNetwork(authorization.chainId) === Network.ETHEREUM &&
          authorization.type === AuthorizationType.ALLOWANCE &&
          isAuthorized(authorization, authorizations) &&
          shouldUpdateSpendingCap
        ) {
          // The MANA contract in ethereum does not allow approving a new allowance unless it is revoked first.
          // This is a workaround so it can be done via the UI, however it is not ideal as it requires two transactions.
          onRevoke(authorization)
        } else {
          onGrant(authorization)
        }
      } else {
        onRevoke(authorization)
      }
    },
    [authorization, onGrant, onRevoke, shouldUpdateSpendingCap, authorizations]
  )

  const { contractAddress, authorizedAddress } = authorization

  const contract = getContract({ address: authorizedAddress })
  const token = getContract({ address: contractAddress })

  if (!contract || !token) {
    return null
  }

  const { network } = getChainConfiguration(token.chainId)

  return (
    <div className="Authorization">
      <Form.Field key={contractAddress} className={isLoading ? 'is-pending' : ''}>
        <Popup
          content={t('settings_page.pending_tx')}
          position="top left"
          trigger={
            <Link to={locations.activity()} className="loader-tooltip">
              <Loader active size="mini" />
            </Link>
          }
        />
        <ChainCheck chainId={authorization.chainId}>
          {isEnabled => (
            <Radio
              checked={isAuthorized(authorization, authorizations) && !shouldUpdateSpendingCap}
              label={token.name}
              disabled={!isEnabled}
              onClick={(_, props: RadioProps) => handleOnChange(!!props.checked)}
            />
          )}
        </ChainCheck>
        <div className="radio-description secondary-text">
          <T
            id="authorization.authorize"
            values={{
              contract_link: (
                <TransactionLink address={authorizedAddress} txHash="" chainId={authorization.chainId}>
                  {contract.label || contract.name}
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
