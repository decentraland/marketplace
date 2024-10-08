import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import classNames from 'classnames'
import { Bid, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Divider, Popup, useMobileMediaQuery } from 'decentraland-ui'
import calendar from '../../../images/calendar.png'
import expiration from '../../../images/expiration.png'
import iconListings from '../../../images/iconListings.png'
import infoIcon from '../../../images/infoIcon.png'
import { formatDistanceToNow } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { isBidTrade } from '../../../modules/bid/utils'
import { locations } from '../../../modules/routing/locations'
import Mana from '../../Mana/Mana'
import { ManaToFiat } from '../../ManaToFiat'
import { Props } from './YourOffer.types'
import styles from './YourOffer.module.css'

const Price = (props: { bid: Bid }) => {
  const { bid } = props

  return (
    <div className={styles.column}>
      <span className={styles.texts}>
        {t('offers_table.offer').toUpperCase()}&nbsp;
        <Popup
          content={
            bid.network === Network.MATIC ? t('best_buying_option.minting.polygon_mana') : t('best_buying_option.minting.ethereum_mana')
          }
          position="top center"
          trigger={<img src={infoIcon} alt="info" className={styles.informationTooltip} />}
          on="hover"
        />
      </span>
      <div className={styles.row}>
        <div className={styles.informationBold}>
          <Mana withTooltip size="large" network={bid.network} className={styles.informationBold}>
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
  )
}

const PublishDate = (props: { bid: Bid }) => {
  const { bid } = props
  return (
    <div className={`${styles.column} ${styles.center}`}>
      <img src={calendar} alt="calendar" className={styles.calendar} />
      <span className={styles.texts}>{t('offers_table.date_published').toUpperCase()}</span>

      {formatDistanceToNow(+bid.createdAt, {
        addSuffix: true
      })}
    </div>
  )
}

const ExpirationDate = (props: { bid: Bid }) => {
  const { bid } = props
  return (
    <div className={`${styles.column} ${styles.center}`}>
      <img src={expiration} alt="expiration" className={styles.calendar} />
      <span className={styles.texts}>{t('offers_table.expiration_date').toUpperCase()}</span>

      {formatDistanceToNow(+bid.expiresAt, {
        addSuffix: true
      })}
    </div>
  )
}

const YourOffer = (props: Props) => {
  const history = useHistory()
  const { bids, address, asset, onCancel, onFetchBids } = props
  const [hasFetched, setHasFetched] = useState(false)

  const isMobile = useMobileMediaQuery()

  const bid = useMemo(() => bids.find(({ bidder }) => bidder === address), [bids, address])

  useEffect(() => {
    if (!hasFetched && asset) {
      setHasFetched(true)
      onFetchBids(asset)
    }
  }, [asset])

  useEffect(() => {
    setHasFetched(false)
  }, [asset])

  return bid ? (
    <div className={styles.YourOffer}>
      <span className={styles.title}>
        <img src={iconListings} alt={t('offers_table.your_offer')} className={styles.offerIcon} />
        {t('offers_table.your_offer')}
      </span>

      <Divider />
      <div className={styles.information}>
        <Price bid={bid} />
        {isMobile ? (
          <div className={classNames(styles.row, styles.dates)}>
            <PublishDate bid={bid} />
            <ExpirationDate bid={bid} />
          </div>
        ) : (
          <>
            <PublishDate bid={bid} />
            <ExpirationDate bid={bid} />
          </>
        )}

        <div className={styles.actionsContainer}>
          <Button inverted fluid className={styles.actions} onClick={() => onCancel(bid)}>
            {t('offers_table.remove')}
          </Button>
          {!isBidTrade(bid) && (
            <Button primary fluid className={styles.actions} onClick={() => history.push(locations.bid(bid.contractAddress, bid.tokenId))}>
              {t('global.update')}
            </Button>
          )}
        </div>
      </div>
    </div>
  ) : null
}

export default React.memo(YourOffer)
