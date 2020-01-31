import React, { useState } from 'react'
import { Page, Header, Button, Field } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { NFTProviderPage } from '../NFTProviderPage'
import NFTAction from '../NFTAction/NFTAction'
import { locations } from '../../modules/routing/locations'
import { getNFTName } from '../../modules/nft/utils'
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
                let isDisabled = isInvalidAddress
                const name = getNFTName(nft)
                if (!!order) {
                  isDisabled = true
                  subtitle = (
                    <T
                      id="transfer_page.for_sale"
                      values={{ name: <b>{name}</b> }}
                    />
                  )
                } else if (wallet.address !== nft.owner.id) {
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
                  <NFTAction nft={nft} onNavigate={onNavigate}>
                    <Header size="large">
                      {t('transfer_page.title', {
                        category: t(`global.${nft.category}`)
                      })}
                    </Header>
                    <div className="subtitle">{subtitle}</div>
                    <div className="fields">
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
                        onChange={(_event, props) => {
                          setAddress(props.value)
                          const isValid =
                            !props.value ||
                            /^0x[a-fA-F0-9]{40}$/g.test(props.value)
                          setIsInvalidAddress(!isValid)
                        }}
                      />
                    </div>
                    <div className="warning">
                      <T id="transfer_page.warning" values={{ br: <br /> }} />
                    </div>
                    <div className="buttons">
                      <Button
                        onClick={() =>
                          onNavigate(
                            locations.ntf(nft.contractAddress, nft.tokenId)
                          )
                        }
                      >
                        {t('global.cancel')}
                      </Button>
                      <Button
                        primary
                        disabled={isDisabled}
                        onClick={() => onTransfer(nft, address)}
                      >
                        {t('transfer_page.submit')}
                      </Button>
                    </div>
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
