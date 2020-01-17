import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { Props } from './CategoriesMenu.types'
import { SearchSection } from '../../modules/routing/search'
import './CategoriesMenu.css'

const CategoriesMenu = (props: Props) => {
  const { section, onNavigate } = props

  const handleSectionChange = useCallback(
    (section: SearchSection) => {
      onNavigate({ page: 1, section })
    },
    [onNavigate]
  )

  return (
    <div className="CategoriesMenu">
      <Header sub>Categories</Header>
      <ul className="menu">
        <li
          className={section === SearchSection.ALL ? 'active' : ''}
          onClick={() => handleSectionChange(SearchSection.ALL)}
        >
          {t('categories_menu.all_assets')}
        </li>
        <li
          className={section === SearchSection.LAND ? 'active' : ''}
          onClick={() => handleSectionChange(SearchSection.LAND)}
        >
          {t('categories_menu.land')}
        </li>
        {[
          SearchSection.LAND,
          SearchSection.PARCELS,
          SearchSection.ESTATES
        ].includes(section) ? (
          <>
            {' '}
            <li
              className={
                section === SearchSection.PARCELS ? 'sub active' : 'sub'
              }
              onClick={() => handleSectionChange(SearchSection.PARCELS)}
            >
              Parcels
            </li>
            <li
              className={
                section === SearchSection.ESTATES ? 'sub active' : 'sub'
              }
              onClick={() => handleSectionChange(SearchSection.ESTATES)}
            >
              {t('categories_menu.estates')}
            </li>
          </>
        ) : null}
        <li
          className={section === SearchSection.WEARABLES ? 'active' : ''}
          onClick={() => handleSectionChange(SearchSection.WEARABLES)}
        >
          {t('categories_menu.wearables')}
        </li>
      </ul>
    </div>
  )
}

export default React.memo(CategoriesMenu)
