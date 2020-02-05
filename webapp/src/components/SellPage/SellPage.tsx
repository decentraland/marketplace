import React, { useState } from 'react'
import addDays from 'date-fns/addDays'
import dateFnsFormat from 'date-fns/format'
import { fromWei } from 'web3x-es/utils'
import { Page, Header, Button, Field, Modal, Mana } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { NFTProviderPage } from '../NFTProviderPage'
import { NFTAction } from '../NFTAction'
import { DEFAULT_EXPIRATION_IN_DAYS } from '../../modules/order/utils'
import { getNFTName, isOwnedBy } from '../../modules/nft/utils'
import { locations } from '../../modules/routing/locations'
import { toMANA, fromMANA } from '../../lib/mana'
import { Props } from './SellPage.types'
import './SellPage.css'

const INPUT_FORMAT = 'yyyy-MM-dd'
const DEFAULT_EXPIRATION_DATE = dateFnsFormat(
  addDays(new Date(), DEFAULT_EXPIRATION_IN_DAYS),
  INPUT_FORMAT
)

const SellPage = (props: Props) => {
  const { order, onNavigate, onCreateOrder } = props
  const isUpdate = order !== null
  const [price, setPrice] = useState(
    isUpdate ? toMANA(+fromWei(order!.price, 'ether')) : ''
  )
  const [expiresAt, setExpiresAt] = useState(
    isUpdate
      ? dateFnsFormat(new Date(+order!.expiresAt), INPUT_FORMAT)
      : DEFAULT_EXPIRATION_DATE
  )
  const [confirmPrice, setConfirmPrice] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <Navbar isFullscreen />
      <Page className="SellPage">
        <Wallet>
          {wallet => (
            <NFTProviderPage>
              {nft => {
                const isInvalidDate = +new Date(expiresAt) < Date.now()
                return (
                  <NFTAction nft={nft}>
                    <Header size="large">
                      {t(
                        isUpdate ? 'sell_page.update_title' : 'sell_page.title'
                      )}
                    </Header>
                    <p className="subtitle">
                      <T
                        id={
                          isUpdate
                            ? 'sell_page.update_subtitle'
                            : 'sell_page.subtitle'
                        }
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
                        placeholder={toMANA(1000).toLocaleString()}
                        value={price}
                        onChange={(_event, props) => {
                          const newPrice = fromMANA(props.value)
                          setPrice(toMANA(newPrice))
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
                          !isOwnedBy(nft, wallet) ||
                          fromMANA(price) <= 0 ||
                          isInvalidDate
                        }
                        onClick={() => setShowConfirm(true)}
                      >
                        {t(
                          isUpdate
                            ? 'sell_page.update_submit'
                            : 'sell_page.submit'
                        )}
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
                            setConfirmPrice(toMANA(newPrice))
                          }}
                        />
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          onClick={() => {
                            setConfirmPrice('')
                            setShowConfirm(false)
                          }}
                        >
                          {t('global.cancel')}
                        </Button>
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
                      </Modal.Actions>
                    </Modal>
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

export default React.memo(SellPage)
