import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Dropdown, Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { Props } from './ListCard.types'
import styles from './ListCard.module.css'
import { AssetImage } from '../../AssetImage'

const ListCard = (props: Props) => {
  const { list, items, onDeleteList, onEditList } = props

  return (
    <Card as={Link} to={locations.list(list.id)} className={styles.card}>
      <div className={styles.image}>
        {true ? (
          <div className={styles.private}>
            <div className={styles.icon}></div>
            {t('list_card.private')}
          </div>
        ) : null}
        {items.length > 0 ? (
          <div className={styles[`grid-${items.length}`]}>
            {items.map(item => (
              <AssetImage key={item.id} asset={item} />
            ))}
          </div>
        ) : null}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.icon}></span>
            <span>{t('list_card.no_items')}</span>
          </div>
        ) : null}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>{list.name}</div>
        <div className={styles.meta}>
          <span className={styles.left}>
            <div className={styles.icon}></div>
            {t('list_card.item_count', { count: list.itemsCount })}
          </span>
          <span>
            <Dropdown
              onClick={e => e.preventDefault()}
              icon={<Icon name="ellipsis vertical" size="large" />}
              direction="left"
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={onDeleteList}
                  text={t('list_card.delete_list')}
                />
                <Dropdown.Item
                  onClick={onEditList}
                  text={t('list_card.edit_list')}
                />
              </Dropdown.Menu>
            </Dropdown>
          </span>
        </div>
      </div>
    </Card>
  )
}

export default React.memo(ListCard)
