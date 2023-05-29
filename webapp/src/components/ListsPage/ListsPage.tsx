import React, { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Dropdown, Header, Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { PAGE_SIZE } from '../../modules/vendor/api'
import { NavigationTab } from '../Navigation/Navigation.types'
import { PageLayout } from '../PageLayout'
import { Props } from './ListsPage.types'
import styles from './ListsPage.module.css'

const ListsPage = ({ count, lists, fetchLists }: Props) => {
  const { search } = useLocation()
  const [page, first] = useMemo(() => {
    const params = new URLSearchParams(search)
    const page = parseInt(params.get('page') ?? '1')
    const first = parseInt(params.get('first') ?? PAGE_SIZE.toString())
    const offset = (page - 1) * first
    return [page, first, offset]
  }, [search])

  useEffect(() => {
    fetchLists({ page, first })
  }, [first, page, fetchLists])

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
              { value: 'name_asc', text: t('filters.name_asc') },
              { value: 'name_desc', text: t('filters.name_desc') },
              { value: 'newest', text: t('filters.newest') },
              { value: 'oldest', text: t('filters.oldest') }
            ]}
            defaultValue="recently_updated"
          />
          <Button size="small" primary>
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
