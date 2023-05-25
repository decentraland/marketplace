import React from 'react'
import { Button, Dropdown, Header, Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Props } from './ListsPage.types'
import styles from './ListsPage.module.css'
import { PageLayout } from '../PageLayout'

const ListsPage = ({ count, lists }: Props) => {
  return (
    <PageLayout activeTab={NavigationTab.MY_LISTS}>
      <Header className={styles.header} size="large">
        {t('lists_page.title')}
      </Header>
      <div className={styles.subHeader}>
        <div>{count}</div>
        <div className={styles.right}>
          {t('filters.sort_by')}
          <Dropdown
            options={[
              {
                value: 'recently_updated',
                text: t('filters.recently_updated')
              },
              { value: 'name', text: t('filters.name_asc') },
              { value: 'name', text: t('filters.name_desc') },
              { value: 'name', text: t('filters.newest') },
              { value: 'name', text: t('filters.oldest') }
            ]}
            defaultValue="recently_updated"
          />
          <Button size="small" primary icon="plus">
            <Icon name="plus" />
            {t('lists_page.create_list')}
          </Button>
        </div>
      </div>
      {lists.map(list => (
        <div key={list.id}>{list.name}</div>
      ))}
    </PageLayout>
  )
}

export default React.memo(ListsPage)
