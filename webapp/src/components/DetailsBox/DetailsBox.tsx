import { memo } from 'react'
import classNames from 'classnames'
import { type RentalListing, RentalStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isNFT } from '../../modules/asset/utils'
import { useGetCurrentOrder } from '../../modules/order/hooks'
import { Box } from '../AssetBrowse/Box'
import { LinkedProfile } from '../LinkedProfile'
import { Availability, Expiration, Type } from './DetailsRow'
import { Info } from './Info'
import { Props } from './DetailsBox.types'
import styles from './DetailsBox.module.css'

const isActiveRental = ({ status }: RentalListing) => status === RentalStatus.OPEN || status === RentalStatus.EXECUTED

export const DetailsBox = (props: Props) => {
  const { asset, rental, className } = props
  const order = useGetCurrentOrder()

  const owner = rental?.lessor && isActiveRental(rental) ? rental.lessor : isNFT(asset) ? asset.owner : asset.creator

  return (
    <Box header={t('details_box.title')} className={classNames(className)}>
      <div className={styles.content}>
        <Type asset={asset} owner={owner} />
        <Info title={t('details_box.network')}>
          <span>{asset.network}</span>
        </Info>

        <Availability asset={asset} />
        <Expiration asset={asset} order={order} rental={rental} />
        {owner ? (
          <Info title={t('details_box.owner')}>
            <LinkedProfile hasPopup={true} address={owner} />
          </Info>
        ) : null}
      </div>
    </Box>
  )
}

export default memo(DetailsBox)
