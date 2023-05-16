import React, { useEffect, useState } from 'react'
import { Bid, Network } from '@dcl/schemas'
import { Button, Divider, Mana, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatDistanceToNow } from '../../../lib/date'
import iconListings from '../../../images/iconListings.png'
import infoIcon from '../../../images/infoIcon.png'
import calendar from '../../../images/calendar.png'
import expiration from '../../../images/expiration.png'
import { bidAPI } from '../../../modules/vendor/decentraland'
import { formatWeiMANA } from '../../../lib/mana'
import { ManaToFiat } from '../../ManaToFiat'
import { Props } from './YourOffer.types'
import styles from './YourOffer.module.css'

const FIRST = '1'

const YourOffer = (props: Props) => {
  const { nft, address, onUpdate, onCancel } = props

  const [bid, setBid] = useState<Bid>()

  useEffect(() => {
    if (nft) {
      bidAPI
        .fetchByNFT(
          nft.contractAddress,
          nft.tokenId,
          null,
          undefined,
          FIRST,
          undefined,
          address
        )
        .then(response => {
          setBid(response.data[0])
        })
        .catch(error => {
          console.error(error)
        })
    }
  }, [nft, setBid, address])

  return bid ? (
    <div className={styles.YourOffer}>
      <span className={styles.title}>
        <img
          src={iconListings}
          alt={t('offers_table.your_offer')}
          className={styles.offerIcon}
        />
        {t('offers_table.your_offer')}
      </span>

      <Divider />
      <div className={`${styles.row} ${styles.bottomInformationPadding}`}>
        <div className={styles.column}>
          <span className={styles.texts}>
            {t('offers_table.offer').toUpperCase()}&nbsp;
            <Popup
              content={
                bid.network === Network.MATIC
                  ? t('best_buying_option.minting.polygon_mana')
                  : t('best_buying_option.minting.ethereum_mana')
              }
              position="top center"
              trigger={
                <img
                  src={infoIcon}
                  alt="info"
                  className={styles.informationTooltip}
                />
              }
              on="hover"
            />
          </span>
          <div className={styles.row}>
            <div className={styles.informationBold}>
              <Mana
                withTooltip
                size="large"
                network={bid.network}
                className={styles.informationBold}
              >
                {formatWeiMANA(bid.price)}
              </Mana>
            </div>
            {+bid.price > 0 && (
              <div className={styles.informationText}>
                &nbsp;{'('}
                <ManaToFiat mana={bid.price} />
                {')'}
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.column} ${styles.center}`}>
          <img src={calendar} alt="calendar" className={styles.calendar} />
          <span className={styles.texts}>
            {t('offers_table.date_published').toUpperCase()}
          </span>

          {formatDistanceToNow(+bid.createdAt, {
            addSuffix: true
          })}
        </div>

        <div className={`${styles.column} ${styles.center}`}>
          <img src={expiration} alt="expiration" className={styles.calendar} />
          <span className={styles.texts}>
            {t('offers_table.expiration_date').toUpperCase()}
          </span>

          {formatDistanceToNow(+bid.expiresAt, {
            addSuffix: true
          })}
        </div>

        <div className={styles.actionsContainer}>
          <Button
            inverted
            className={styles.actions}
            onClick={() => onCancel(bid)}
          >
            {t('offers_table.remove')}
          </Button>
          <Button
            primary
            className={styles.actions}
            onClick={() => onUpdate(bid)}
          >
            {t('global.update')}
          </Button>
        </div>
      </div>
    </div>
  ) : null
}

export default React.memo(YourOffer)
