import React, { useState } from 'react'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Header, Form, Field, Button } from 'decentraland-ui'
import { AssetType } from '../../modules/asset/types'
import { getAssetName, isOwnedBy } from '../../modules/asset/utils'
import { locations } from '../../modules/routing/locations'
import { AssetAction } from '../AssetAction'
import { AssetProviderPage } from '../AssetProviderPage'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { Wallet } from '../Wallet'
import { Props } from './TransferPage.types'
import './TransferPage.css'

const TransferPage = (props: Props) => {
  const { onNavigate, onTransfer, isTransferring } = props

  const [address, setAddress] = useState('')
  const [isInvalidAddress, setIsInvalidAddress] = useState(false)

  return (
    <>
      <Navbar isFullscreen />
      <Page className="TransferPage">
        <Wallet>
          {wallet => (
            <AssetProviderPage type={AssetType.NFT}>
              {(nft, order) => {
                let subtitle
                let isDisabled = !address || isInvalidAddress || isTransferring
                let canTransfer = true
                const subtitleClasses = ['subtitle']
                const name = getAssetName(nft)
                if (order) {
                  isDisabled = true
                  canTransfer = false
                  subtitleClasses.push('error')
                  subtitle = <T id="transfer_page.for_sale" values={{ name: <b>{name}</b> }} />
                } else if (!isOwnedBy(nft, wallet)) {
                  isDisabled = true
                  canTransfer = false
                  subtitleClasses.push('error')
                  subtitle = <T id="transfer_page.invalid_owner" values={{ name: <b>{name}</b> }} />
                } else {
                  subtitle = <T id="transfer_page.subtitle" values={{ name: <b>{name}</b> }} />
                }
                return (
                  <AssetAction asset={nft}>
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
                          message={isInvalidAddress ? t('transfer_page.invalid_address') : undefined}
                          label={t('transfer_page.recipient')}
                          value={address}
                          placeholder="0x..."
                          disabled={!canTransfer}
                          onChange={(_event, props) => {
                            setAddress(props.value)
                            const isValid = !props.value || /^0x[a-fA-F0-9]{40}$/g.test(props.value)
                            setIsInvalidAddress(!isValid)
                          }}
                        />
                      </div>
                      {canTransfer ? (
                        <div className="warning">
                          <T id="transfer_page.warning" values={{ br: <br /> }} />
                        </div>
                      ) : null}
                      <div className="buttons">
                        <Button
                          as="div"
                          disabled={isTransferring}
                          onClick={() => onNavigate(locations.nft(nft.contractAddress, nft.tokenId))}
                        >
                          {t('global.cancel')}
                        </Button>
                        <ChainButton type="submit" primary loading={isTransferring} disabled={isDisabled} chainId={nft.chainId}>
                          {t('transfer_page.submit')}
                        </ChainButton>
                      </div>
                    </Form>
                  </AssetAction>
                )
              }}
            </AssetProviderPage>
          )}
        </Wallet>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(TransferPage)
