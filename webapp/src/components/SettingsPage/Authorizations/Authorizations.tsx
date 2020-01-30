import React, { useCallback } from 'react'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { EtherscanLink } from 'decentraland-dapps/dist/containers'
import { Form, CheckboxProps, Radio, Loader } from 'decentraland-ui'
import { Link } from 'react-router-dom'

import {
  contractSymbols,
  getContractName
} from '../../../modules/contract/utils'
import { locations } from '../../../modules/routing/locations'
import { hasTransactionPending } from '../../../modules/transaction/utils'
import { Props } from './Authorizations.types'

const Authorizations = (props: Props) => {
  const { privilege, contractAddress, pendingTransactions, onChange } = props

  const contractName = getContractName(contractAddress)

  const handleOnChange = useCallback(
    (tokenContractAddress: string, isChecked: boolean) =>
      onChange(isChecked, contractAddress, tokenContractAddress),
    [contractAddress, onChange]
  )

  if (!privilege) {
    return null
  }

  return (
    <>
      {Object.keys(privilege).map(tokenContractAddress => (
        <Form.Field
          key={tokenContractAddress}
          className={
            hasTransactionPending(
              pendingTransactions,
              contractAddress,
              tokenContractAddress
            )
              ? 'is-pending'
              : ''
          }
        >
          <Link
            to={locations.activity()}
            className="loader-tooltip"
            data-balloon={t('settings_page.pending_tx')}
            data-balloon-pos="up"
            data-balloon-length="large"
          >
            <Loader active size="mini" />
          </Link>
          <Radio
            checked={privilege[tokenContractAddress]}
            label={t(
              `settings_page.authorization_${contractName}_${getContractName(
                tokenContractAddress
              )}`,
              { token: contractSymbols[tokenContractAddress] }
            )}
            onClick={(_, data: CheckboxProps) =>
              handleOnChange(tokenContractAddress, !!data.checked)
            }
          />
          <div className="radio-description secondary-text">
            <T
              id="authorization.authorize"
              values={{
                contract_link: (
                  <EtherscanLink address={contractAddress} txHash="">
                    {contractName}
                  </EtherscanLink>
                ),
                symbol: contractSymbols[tokenContractAddress]
              }}
            />
          </div>
        </Form.Field>
      ))}
    </>
  )
}

export default React.memo(Authorizations)
