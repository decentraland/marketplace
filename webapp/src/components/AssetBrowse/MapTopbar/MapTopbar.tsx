import { useCallback } from 'react'
import classNames from 'classnames'
import {
  Button,
  CheckboxProps,
  Container,
  Popup,
  Radio,
  useTabletAndBelowMediaQuery
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { persistIsMapProperty } from '../../../modules/ui/utils'
import { Chip } from '../../Chip'
import { Props } from './MapTopbar.types'
import styles from './MapTopbar.module.css'

export const MapTopbar = ({
  onlyOnSale,
  onlyOnRent,
  showOwned,
  onBrowse,
  onShowOwnedChange
}: Props): JSX.Element | null => {
  const isMobileOrTable = useTabletAndBelowMediaQuery()

  const handleIsMapChange = useCallback(
    (isMap: boolean) => {
      persistIsMapProperty(isMap)

      onBrowse({
        isMap,
        isFullscreen: isMap,
        search: '',
        // Forces the onlyOnSale property in the defined cases so the users can see LAND on sale.
        onlyOnSale:
          (!onlyOnSale && onlyOnRent === false) ||
          (onlyOnSale === undefined && onlyOnRent === undefined) ||
          onlyOnSale
      })
    },
    [onBrowse, onlyOnSale, onlyOnRent]
  )

  const handleOnSaleChange = useCallback(
    (_, { checked }: CheckboxProps) => {
      onBrowse({ onlyOnSale: checked })
    },
    [onBrowse]
  )

  const handleOnRentChange = useCallback(
    (_, { checked }: CheckboxProps) => {
      onBrowse({ onlyOnRent: checked })
    },
    [onBrowse]
  )

  const handleShowOwnedChange = useCallback(
    (_, { checked }: CheckboxProps) => {
      if (onShowOwnedChange) {
        onShowOwnedChange(!!checked)
      }
    },
    [onShowOwnedChange]
  )

  const mapToggle = (
    <div className={styles.mapToggle}>
      <Chip
        className="grid"
        icon="table"
        isActive={false}
        onClick={handleIsMapChange.bind(null, false)}
      />
      <Chip
        className="atlas"
        icon="map marker alternate"
        isActive
        onClick={handleIsMapChange.bind(null, true)}
      />
    </div>
  )

  const filters = (
    <>
      <Radio
        label={t('nft_filters.map.on_sale')}
        checked={!!onlyOnSale}
        onClick={handleOnSaleChange}
        type="checkbox"
        className="square-checkbox"
      />
      <Radio
        label={t('nft_filters.map.on_rent')}
        checked={!!onlyOnRent}
        onClick={handleOnRentChange}
        type="checkbox"
        className="square-checkbox"
      />
      <Radio
        label={t('nft_filters.map.owned')}
        checked={!!showOwned}
        onClick={handleShowOwnedChange}
        type="checkbox"
        className="square-checkbox"
      />
    </>
  )

  if (isMobileOrTable) {
    return (
      <div className={styles.filterBar}>
        <Popup
          content={<div className={styles.filtersMobile}>{filters}</div>}
          position="bottom right"
          trigger={
            <Button
              primary
              className={styles.filtersButton}
              aria-label="filters"
            >
              <span aria-label="filters-icon" className={styles.filtersIcon} />
            </Button>
          }
          on="click"
          className={styles.filtersPopup}
          onClose={(evt) => evt.stopPropagation()}
        />
        {mapToggle}
      </div>
    )
  }

  return (
    <Container>
      <div className={styles.filterBar}>
        <div className={classNames(styles.searchContainer)}>
          {filters}
          {mapToggle}
        </div>
      </div>
    </Container>
  )
}
