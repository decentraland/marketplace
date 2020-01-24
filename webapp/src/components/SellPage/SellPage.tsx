import React, { useState } from 'react'
import addDays from 'date-fns/addDays'
import dateFnsFormat from 'date-fns/format'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Page, Header, Button, Field, Modal, Mana } from 'decentraland-ui'
import { Wallet } from '../Wallet'
import { NFTProvider } from '../NFTProvider'
import { NFTAction } from '../NFTAction'
import { getNFTName } from '../../modules/nft/utils'
import { locations } from '../../modules/routing/locations'
import { Props } from './SellPage.types'
import './SellPage.css'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'

const DEFAULT_EXPIRATION_IN_DAYS = 30
const INPUT_FORMAT = 'yyyy-MM-dd'
const DEFAULT_EXPIRATION_DATE = dateFnsFormat(
  addDays(new Date(), DEFAULT_EXPIRATION_IN_DAYS),
  INPUT_FORMAT
)

const toMANA = (num: number) => (num > 0 ? '⏣ ' + num.toLocaleString() : '')
const fromMANA = (mana: string) => {
  const num = mana
    .split('⏣ ')
    .join('')
    .split(',')
    .join('')
  const result = parseInt(num)
  if (isNaN(result) || result < 0) {
    return 0
  }
  return result
}

const SellPage = (props: Props) => {
  const { onNavigate, onCreateOrder } = props
  const [price, setPrice] = useState('')
  const [confirmPrice, setConfirmPrice] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [expiresAt, setExpiresAt] = useState(DEFAULT_EXPIRATION_DATE)
  return (
    <>
      <Navbar isFullscreen />
      <Page className="SellPage">
        <Wallet>
          {wallet => (
            <NFTProvider>
              {nft => {
                const isInvalidDate = +new Date(expiresAt) < Date.now()
                return (
                  <NFTAction nft={nft}>
                    <Header size="large">{t('sell_page.title')}</Header>
                    <p className="subtitle">
                      <T
                        id="sell_page.subtitle"
                        values={{
                          name: (
                            <b className="primary-text">{getNFTName(nft)}</b>
                          )
                        }}
                      />
                    </p>
                    <div className="fields">
                      <Field
                        label={t('sell_page.price')}
                        placeholder={'⏣ ' + (1000).toLocaleString()}
                        value={price}
                        onChange={(_event, props) => {
                          const newPrice = fromMANA(props.value)
                          setPrice(newPrice > 0 ? toMANA(newPrice) : '')
                        }}
                      />
                      <Field
                        label={t('sell_page.expiration_date')}
                        type="date"
                        value={expiresAt}
                        onChange={(_event, props) =>
                          setExpiresAt(props.value || DEFAULT_EXPIRATION_DATE)
                        }
                        error={isInvalidDate}
                        message={
                          isInvalidDate
                            ? t('sell_page.invalid_date')
                            : undefined
                        }
                      />
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
                        disabled={
                          wallet.address !== nft.owner.id ||
                          fromMANA(price) <= 0 ||
                          isInvalidDate
                        }
                        onClick={() => setShowConfirm(true)}
                      >
                        {t('sell_page.submit')}
                      </Button>
                    </div>
                    <Modal
                      size="small"
                      open={showConfirm}
                      className="ConfirmPriceModal"
                    >
                      <Modal.Header>
                        {t('sell_page.confirm.title')}
                      </Modal.Header>
                      <Modal.Content>
                        <T
                          id="sell_page.confirm.line_one"
                          values={{
                            name: <b>{getNFTName(nft)}</b>,
                            amount: (
                              <Mana inline>
                                {fromMANA(price).toLocaleString()}
                              </Mana>
                            )
                          }}
                        />
                        <br />
                        <T id="sell_page.confirm.line_two" />
                        <Field
                          label={t('sell_page.price')}
                          placeholder={price}
                          value={confirmPrice}
                          onChange={(_event, props) => {
                            const newPrice = fromMANA(props.value)
                            setConfirmPrice(
                              newPrice > 0 ? toMANA(newPrice) : ''
                            )
                          }}
                        />
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          primary
                          disabled={fromMANA(price) !== fromMANA(confirmPrice)}
                          onClick={() =>
                            onCreateOrder(
                              nft,
                              fromMANA(price),
                              +new Date(expiresAt)
                            )
                          }
                        >
                          {t('global.proceed')}
                        </Button>
                        <Button
                          onClick={() => {
                            setConfirmPrice('')
                            setShowConfirm(false)
                          }}
                        >
                          {t('global.cancel')}
                        </Button>
                      </Modal.Actions>
                    </Modal>
                  </NFTAction>
                )
              }}
            </NFTProvider>
          )}
        </Wallet>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(SellPage)
