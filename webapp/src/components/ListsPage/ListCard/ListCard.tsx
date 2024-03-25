import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Dropdown, Icon } from 'decentraland-ui'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { SortBy } from '../../../modules/routing/types'
import { View } from '../../../modules/ui/types'
import { VendorName } from '../../../modules/vendor'
import { Section } from '../../../modules/vendor/decentraland'
import { DEFAULT_FAVORITES_LIST_ID } from '../../../modules/vendor/decentraland/favorites/api'
import { AssetImage } from '../../AssetImage'
import { PrivateTag } from '../../PrivateTag'
import {
  ACTIONS_DATA_TEST_ID,
  DELETE_LIST_DATA_TEST_ID,
  EDIT_LIST_DATA_TEST_ID,
  EMPTY_PREVIEW_DATA_TEST_ID,
  GRID_PREVIEW_DATA_TEST_ID,
  ITEM_COUNT_DATA_TEST_ID,
  LIST_NAME_DATA_TEST_ID,
  PRIVATE_DATA_TEST_ID
} from './constants'
import { Props } from './ListCard.types'
import styles from './ListCard.module.css'

const ListCard = (props: Props) => {
  const { list, items, onDeleteList, onEditList, viewOnly = false } = props

  const isViewOnly = useMemo(() => list.id === DEFAULT_FAVORITES_LIST_ID || viewOnly, [list, viewOnly])

  return (
    <Card
      as={Link}
      to={locations.list(list.id, {
        assetType: AssetType.ITEM,
        page: 1,
        section: Section.LISTS,
        view: View.LISTS,
        vendor: VendorName.DECENTRALAND,
        sortBy: SortBy.NEWEST
      })}
      className={classnames(styles.ListCard, isViewOnly && styles.viewOnly)}
    >
      <div className={styles.image}>
        {list.isPrivate ? <PrivateTag data-testid={PRIVATE_DATA_TEST_ID} className={styles.private} /> : null}
        {items.length > 0 ? (
          <div className={styles[`grid-${items.length}`]} data-testid={GRID_PREVIEW_DATA_TEST_ID}>
            {items.map(item => (
              <AssetImage key={item.id} asset={item} />
            ))}
          </div>
        ) : null}
        {items.length === 0 ? (
          <div className={styles.empty} data-testid={EMPTY_PREVIEW_DATA_TEST_ID}>
            <span className={styles.icon}></span>
            <span>{t('list_card.no_items')}</span>
          </div>
        ) : null}
      </div>
      <div className={styles.content}>
        <div className={styles.header} data-testid={LIST_NAME_DATA_TEST_ID}>
          {list.name}
        </div>
        <div className={styles.meta}>
          <span className={styles.left} data-testid={ITEM_COUNT_DATA_TEST_ID}>
            <div className={styles.icon}></div>
            {t('list_card.item_count', { count: list.itemsCount })}
          </span>
          <span>
            {!isViewOnly ? (
              <Dropdown
                data-testid={ACTIONS_DATA_TEST_ID}
                onClick={e => e.preventDefault()}
                icon={<Icon name="ellipsis vertical" size="large" />}
                direction="left"
              >
                <Dropdown.Menu>
                  <Dropdown.Item data-testid={EDIT_LIST_DATA_TEST_ID} onClick={onEditList} text={t('list_card.edit_list')} />
                  <Dropdown.Item data-testid={DELETE_LIST_DATA_TEST_ID} onClick={onDeleteList} text={t('list_card.delete_list')} />
                </Dropdown.Menu>
              </Dropdown>
            ) : null}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default React.memo(ListCard)
