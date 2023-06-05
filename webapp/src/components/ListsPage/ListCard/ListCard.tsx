import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Dropdown, Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { DEFAULT_FAVORITES_LIST_ID } from '../../../modules/vendor/decentraland/favorites/api'
import { AssetImage } from '../../AssetImage'
import { Props } from './ListCard.types'
import styles from './ListCard.module.css'

export const EMPTY_PREVIEW_DATA_TEST_ID = 'list-card-empty-preview'
export const GRID_PREVIEW_DATA_TEST_ID = 'list-card-grid-preview'
export const LIST_NAME_DATA_TEST_ID = 'list-card-list-name'
export const ITEM_COUNT_DATA_TEST_ID = 'list-card-item-count'
export const PRIVATE_DATA_TEST_ID = 'list-card-private'
export const EDIT_LIST_DATA_TEST_ID = 'list-card-edit-list'
export const DELETE_LIST_DATA_TEST_ID = 'list-card-delete-list'
export const ACTIONS_DATA_TEST_ID = 'list-card-actions'

const ListCard = (props: Props) => {
  const { list, items, onDeleteList, onEditList } = props
  const isWishlist = list.id === DEFAULT_FAVORITES_LIST_ID

  return (
    <Card as={Link} to={locations.list(list.id)} className={styles.card}>
      <div className={styles.image}>
        {list.isPrivate ? (
          <div className={styles.private} data-testid={PRIVATE_DATA_TEST_ID}>
            <div className={styles.icon}></div>
            {t('list_card.private')}
          </div>
        ) : null}
        {items.length > 0 ? (
          <div
            className={styles[`grid-${items.length}`]}
            data-testid={GRID_PREVIEW_DATA_TEST_ID}
          >
            {items.map(item => (
              <AssetImage key={item.id} asset={item} />
            ))}
          </div>
        ) : null}
        {items.length === 0 ? (
          <div
            className={styles.empty}
            data-testid={EMPTY_PREVIEW_DATA_TEST_ID}
          >
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
            {!isWishlist ? (
              <Dropdown
                data-testid={ACTIONS_DATA_TEST_ID}
                onClick={e => e.preventDefault()}
                icon={<Icon name="ellipsis vertical" size="large" />}
                direction="left"
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    data-testid={EDIT_LIST_DATA_TEST_ID}
                    onClick={onEditList}
                    text={t('list_card.edit_list')}
                  />
                  <Dropdown.Item
                    data-testid={DELETE_LIST_DATA_TEST_ID}
                    onClick={onDeleteList}
                    text={t('list_card.delete_list')}
                  />
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
