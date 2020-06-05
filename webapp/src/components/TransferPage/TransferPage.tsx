import React, { useState } from 'react'
import { Page, Header, Form, Field, Button } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { NFTProviderPage } from '../NFTProviderPage'
import { NFTAction } from '../NFTAction'
import { locations } from '../../modules/routing/locations'
import { getNFTName, isOwnedBy } from '../../modules/nft/utils'
import { Props } from './TransferPage.types'
import './TransferPage.css'

const TransferPage = (props: Props) => {
  const { onNavigate, onTransfer } = props

  const [address, setAddress] = useState('')
  const [isInvalidAddress, setIsInvalidAddress] = useState(false)

  return (
    <>
      <Navbar isFullscreen />
      <Page className="TransferPage">
        <Wallet>
          {wallet => (
            <NFTProviderPage>
              {(nft, order) => {
                let subtitle
                let isDisabled = !address || isInvalidAddress
                let canTransfer = true
                const subtitleClasses = ['subtitle']
                const name = getNFTName(nft)
                if (order) {
                  isDisabled = true
                  canTransfer = false
                  subtitleClasses.push('error')
                  subtitle = (
                    <T
                      id="transfer_page.for_sale"
                      values={{ name: <b>{name}</b> }}
                    />
                  )
                } else if (!isOwnedBy(nft, wallet)) {
                  isDisabled = true
                  canTransfer = false
                  subtitleClasses.push('error')
                  subtitle = (
                    <T
                      id="transfer_page.invalid_owner"
                      values={{ name: <b>{name}</b> }}
                    />
                  )
                } else {
                  subtitle = (
                    <T
                      id="transfer_page.subtitle"
                      values={{ name: <b>{name}</b> }}
                    />
                  )
                }
                return (
                  <NFTAction nft={nft}>
                    <Header size="large">
                      {t('transfer_page.title', {
                        category: t(`global.${nft.category}`)
                      })}
                    </Header>
                    <div className={subtitleClasses.join(' ')}>{subtitle}</div>
                    <Form onSubmit={() => onTransfer(nft, address)}>
                      <div className="form-fields">
                        <Field
                          type="address"
                          error={isInvalidAddress}
                          message={
                            isInvalidAddress
                              ? t('transfer_page.invalid_address')
                              : undefined
                          }
                          label={t('transfer_page.recipient')}
                          value={address}
                          placeholder="0x..."
                          disabled={!canTransfer}
                          onChange={(_event, props) => {
                            setAddress(props.value)
                            const isValid =
                              !props.value ||
                              /^0x[a-fA-F0-9]{40}$/g.test(props.value)
                            setIsInvalidAddress(!isValid)
                          }}
                        />
                      </div>
                      {canTransfer ? (
                        <div className="warning">
                          <T
                            id="transfer_page.warning"
                            values={{ br: <br /> }}
                          />
                        </div>
                      ) : null}
                      <div className="buttons">
                        <div
                          className="ui button"
                          onClick={() =>
                            onNavigate(
                              locations.ntf(nft.contractAddress, nft.tokenId)
                            )
                          }
                        >
                          {t('global.cancel')}
                        </div>
                        <Button type="submit" primary disabled={isDisabled}>
                          {t('transfer_page.submit')}
                        </Button>
                      </div>
                    </Form>
                  </NFTAction>
                )
              }}
            </NFTProviderPage>
          )}
        </Wallet>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(TransferPage)
