import React, { useCallback } from 'react'
// import { Link } from 'react-router-dom'
import intlFormat from 'date-fns/intlFormat'
import classNames from 'classnames'
import { Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
// import { locations } from '../../../modules/routing/locations'
import { formatWeiMANA } from '../../../lib/mana'
import { LandLockedPopup } from '../../LandLockedPopup'
import { isLandLocked } from '../../../modules/rental/utils'
import Mana from '../../Mana/Mana'
import { IconButton } from '../IconButton'
import { Props } from './Sell.types'
import styles from './Sell.module.css'
// import { SellModal } from '../../Modals/SellModal'
// import { closeModal } from 'decentraland-dapps/dist/modules/modal/actions'
// import { PayloadAction } from 'typesafe-actions'

const Sell = (props: Props) => {
  const {
    className,
    rental,
    order = null,
    nft,
    onEditOrder,
    onCancelOrder,
    userAddress,
    onListForSale
  } = props
  // const [openSale, setOpenSale] = useState(true)

  const areActionsLocked =
    rental !== null && isLandLocked(userAddress, rental, nft)

  const handleOnListForSale = useCallback(() => {
    onListForSale(nft, order)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className={classNames(styles.box, className)}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {order
            ? t('manage_asset_page.sell.selling_title')
            : t('manage_asset_page.sell.sell_title')}
        </h1>
        <div className={styles.action}>
          {order ? (
            <>
              <IconButton
                iconName="pencil"
                disabled={areActionsLocked}
                onClick={onEditOrder}
              />
              <IconButton
                iconName="trash alternate"
                disabled={areActionsLocked}
                onClick={onCancelOrder}
              />
            </>
          ) : (
            <LandLockedPopup
              asset={nft}
              rental={rental}
              userAddress={userAddress}
            >
              <Button
                className={styles.sellButton}
                disabled={areActionsLocked}
                // as={Link}
                // to={locations.sell(nft.contractAddress, nft.tokenId)}
                onClick={handleOnListForSale}
                fluid
              >
                {t('manage_asset_page.sell.list_for_sale')}
              </Button>
            </LandLockedPopup>
          )}
        </div>
      </div>
      {order ? (
        <div
          className={classNames(styles.content, {
            [styles.isLandLocked]: areActionsLocked
          })}
        >
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              {t('manage_asset_page.sell.price')}
            </div>
            <div className={styles.columnContent}>
              <Mana withTooltip size={'medium'} network={order.network}>
                {formatWeiMANA(order.price)}
              </Mana>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              {t('manage_asset_page.sell.expiration_date')}
            </div>
            <div className={styles.columnContent}>
              {intlFormat(order.expiresAt)}
            </div>
          </div>
        </div>
      ) : null}
      {/* {openSale && (
        <SellModal
          title={'hola'}
          confirm_transaction_message={'hola'}
          action_message={'hola'}
          name={'hola'}
          onSubmitTransaction={() => {}}
          isTransactionBeingConfirmed={false}
          order={null}
          isDisabled={false}
          isSubmittingTransaction={false}
          nft={nft}
          // authorizations,
          wallet={null}
          getContract={() => null}
          onClose={() => closeModal('SellModal')}
          children={undefined}
          error={null}
          onCreateOrder={undefined}
          authorizations={[]} // onCreateOrder,
        />
      )} */}
    </section>
  )
}

export default React.memo(Sell)
