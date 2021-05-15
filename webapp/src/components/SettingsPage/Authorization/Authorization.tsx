import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { TransactionLink } from 'decentraland-dapps/dist/containers'
import { Form, Radio, Loader, Popup, RadioProps } from 'decentraland-ui'
import { locations } from '../../../modules/routing/locations'
import { hasTransactionPending } from '../../../modules/transaction/utils'
import { getContract } from '../../../modules/contract/utils'
import { isAuthorized } from './utils'
import { Props } from './Authorization.types'
import './Authorization.css'

const Authorizations = (props: Props) => {
  const {
    authorization,
    authorizations,
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
    props.isLoading ||
    hasTransactionPending(
      pendingTransactions,
      authorizedAddress,
      contractAddress
    )

  const contract = getContract({ address: authorizedAddress })
  const token = getContract({ address: contractAddress })

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
              symbol: token.name
            }}
          />
        </div>
      </Form.Field>
    </div>
  )
}

export default React.memo(Authorizations)
