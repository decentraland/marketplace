import React, { useState, useEffect, useCallback } from 'react'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Footer, EtherscanLink } from 'decentraland-dapps/dist/containers'
import { Link } from 'react-router-dom'
import {
  Page,
  Grid,
  Blockie,
  Mana,
  Loader,
  CheckboxProps,
  Form,
  Checkbox
} from 'decentraland-ui'
import CopyToClipboard from 'react-copy-to-clipboard'

import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { contractSymbols, getContractName } from '../../modules/contract/utils'
import { locations } from '../../modules/routing/locations'
import { Props } from './SettingsPage.types'
import './SettingsPage.css'

const BUY_MANA_URL = process.env.REACT_APP_BUY_MANA_URL

const SettingsPage = (props: Props) => {
  const {
    wallet,
    authorizations,
    pendingAllowTransactions,
    pendingApproveTransactions,
    isConnecting,
    onNavigate
  } = props

  const [hasCopiedText, setHasCopiedText] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
    undefined
  )

  const handleOnCopy = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setHasCopiedText(true)
    const newTimeoutId = setTimeout(() => setHasCopiedText(false), 1200)
    setTimeoutId(newTimeoutId)
  }, [timeoutId])

  useEffect(() => {
    if (!isConnecting && !wallet) {
      onNavigate(locations.signIn())
    }
  }, [isConnecting, wallet, onNavigate])

  console.log(authorizations)
  const hasEmptyAuthorizations =
    authorizations == null || Object.keys(authorizations).length === 0

  return (
    <>
      <Navbar isFullscreen />
      <Navigation />
      <Page className="SettingsPage">
        {isConnecting ? (
          <Loader size="massive" active />
        ) : wallet ? (
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <div className="left-column secondary-text">Address</div>
              </Grid.Column>
              <Grid.Column width={12}>
                <Blockie seed={wallet!.address} scale={12} />
                <div className="address-container">
                  <div className="address">{wallet!.address}</div>
                  <CopyToClipboard text={wallet!.address} onCopy={handleOnCopy}>
                    {hasCopiedText ? (
                      <span className="copy-text">
                        {t('settings_page.copied')}
                      </span>
                    ) : (
                      <span className="copy-text link">
                        {t('settings_page.copy_address')}
                      </span>
                    )}
                  </CopyToClipboard>
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4}>
                <div className="left-column secondary-text">Balance</div>
              </Grid.Column>
              <Grid.Column width={12}>
                <div className="balance">
                  <Mana inline>{wallet!.mana}</Mana>
                  {BUY_MANA_URL ? (
                    <a
                      className="buy-more"
                      href={BUY_MANA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('settings_page.buy_more_mana')}
                    </a>
                  ) : null}
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4}>
                <div className="left-column secondary-text">Authorizations</div>
              </Grid.Column>
              <Grid.Column width={12}>
                <div className="authorization-checks-container">
                  {hasEmptyAuthorizations ? (
                    <div className="authorization-checks">
                      <p className="danger-text">
                        {t('settings_page.authorization_error')}
                        <br />
                        {t('settings_page.authorization_error_contact')}
                      </p>
                    </div>
                  ) : (
                    <Form>
                      <div className="authorization-checks">
                        <label>{t('settings_page.for_buying')}</label>

                        {Object.keys(
                          authorizations!.allowances
                        ).map(contractAddress =>
                          renderAllowance(
                            pendingAllowTransactions,
                            authorizations!.allowances[contractAddress],
                            contractAddress
                          )
                        )}
                      </div>
                      <div className="authorization-checks">
                        <label>{t('settings_page.for_selling')}</label>

                        {Object.keys(
                          authorizations!.approvals
                        ).map(contractAddress =>
                          renderApproval(
                            pendingApproveTransactions,
                            authorizations!.approvals[contractAddress],
                            contractAddress
                          )
                        )}
                      </div>
                    </Form>
                  )}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : null}
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(SettingsPage)

function renderAllowance(
  pendingAllowTransactions: any,
  allowance: any,
  contractAddress: string
) {
  return Object.keys(allowance).map(tokenContractName => (
    <Form.Field key={tokenContractName}>
      {hasTransactionPending(
        pendingAllowTransactions,
        contractAddress,
        tokenContractName
      ) ? (
        renderLoading()
      ) : (
        <Checkbox
          checked={allowance[tokenContractName] > 0}
          onChange={getTokenAllowedChange(contractAddress, tokenContractName)}
        />
      )}
      <div className="title">
        {t(`settings.for_buying_${contractAddress}`, {
          token: contractSymbols[tokenContractName]
        })}
      </div>
      <div className="description">
        <T
          id="authorization.allow"
          values={{
            contract_link: (
              <EtherscanLink address={contractAddress} txHash="">
                {getContractName(contractAddress)}
              </EtherscanLink>
            ),
            symbol: contractSymbols[tokenContractName]
          }}
        />
      </div>
    </Form.Field>
  ))
}

function renderApproval(
  pendingApproveTransactions: any,
  approval: any,
  contractAddress: string
) {
  return Object.keys(approval).map(tokenContractName => (
    <Form.Field key={tokenContractName}>
      {hasTransactionPending(
        pendingApproveTransactions,
        contractAddress,
        tokenContractName
      ) ? (
        renderLoading()
      ) : (
        <Checkbox
          checked={approval[tokenContractName]}
          onChange={getTokenApprovedChange(contractAddress, tokenContractName)}
        />
      )}
      <div className="title">{contractSymbols[tokenContractName]}</div>
      <div className="description">
        <T
          id="authorization.approve"
          values={{
            contract_link: (
              <EtherscanLink address={contractAddress} txHash="">
                {getContractName(contractAddress)}
              </EtherscanLink>
            ),
            symbol: contractSymbols[tokenContractName]
          }}
        />
      </div>
    </Form.Field>
  ))
}

function renderLoading() {
  return (
    <Link
      to={locations.activity()}
      className="loader-tooltip"
      data-balloon={t('settings.pending_tx')}
      data-balloon-pos="up"
      data-balloon-length="large"
    >
      <Loader active size="mini" />
    </Link>
  )
}

function hasTransactionPending(
  transactions: any,
  contractAddress: string,
  tokenContractAddress: string
) {
  return transactions.some(
    (transaction: any) =>
      transaction.payload.contractAddress === contractAddress &&
      transaction.payload.tokenContractAddress === tokenContractAddress
  )
}

function getTokenAllowedChange(
  contractAddress: string,
  tokenContractAddress: string
) {
  return (_: React.FormEvent<HTMLInputElement>, data: CheckboxProps) =>
    console.log(contractAddress, tokenContractAddress, data)
  //     this.props.onTokenAllowedChange(
  //       data.checked,
  //       contractAddress,
  //       tokenContractAddress
  //     )
}

function getTokenApprovedChange(
  contractAddress: string,
  tokenContractAddress: string
) {
  return (_: React.FormEvent<HTMLInputElement>, data: CheckboxProps) =>
    console.log(contractAddress, tokenContractAddress, data)
  //     this.props.onTokenApprovedChange(
  //       data.checked,
  //       contractAddress,
  //       tokenContractAddress
  //     )
}
