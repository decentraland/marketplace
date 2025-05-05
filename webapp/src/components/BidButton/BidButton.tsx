import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Button, Icon } from 'decentraland-ui'
import makeOffer from '../../images/make_offer.svg'
import { isNFT } from '../../modules/asset/utils'
import { locations } from '../../modules/routing/locations'
import { Props } from './BidButton.types'
import styles from './BidButton.module.css'

export default function BidButton(props: Props) {
  const { asset, alreadyBid, disabled } = props
  const link = isNFT(asset) ? locations.bid(asset.contractAddress, asset.tokenId) : locations.bidItem(asset.contractAddress, asset.itemId)
  return (
    <Button
      as={Link}
      role="link"
      secondary
      inverted
      to={link}
      data-testid="bid-button"
      className={classNames(styles.bidButton, { [styles.alreadyBid]: alreadyBid })}
      disabled={alreadyBid || disabled}
    >
      {alreadyBid ? <Icon name="lock" /> : <img src={makeOffer} alt={t('bid_button.bid')} />}
      {alreadyBid ? t('bid_button.blocked') : t('bid_button.bid')}
    </Button>
  )
}
