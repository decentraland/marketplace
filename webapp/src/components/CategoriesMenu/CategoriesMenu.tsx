import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { Props } from './CategoriesMenu.types'
import { Section } from '../../modules/routing/search'
import './CategoriesMenu.css'

const CategoriesMenu = (props: Props) => {
  const { section, onNavigate } = props

  const handleSectionChange = useCallback(
    (section: Section) => {
      onNavigate({ page: 1, section })
    },
    [onNavigate]
  )

  return (
    <div className="CategoriesMenu">
      <Header sub>{t('categories_menu.categories')}</Header>
      <ul className="menu">
        <li
          className={section === Section.ALL ? 'active' : ''}
          onClick={() => handleSectionChange(Section.ALL)}
        >
          {t('categories_menu.all_assets')}
        </li>
        <li
          className={section === Section.LAND ? 'active' : ''}
          onClick={() => handleSectionChange(Section.LAND)}
        >
          {t('categories_menu.land')}
        </li>
        {[Section.LAND, Section.PARCELS, Section.ESTATES].includes(section) ? (
          <>
            <li
              className={section === Section.PARCELS ? 'sub active' : 'sub'}
              onClick={() => handleSectionChange(Section.PARCELS)}
            >
              {t('categories_menu.parcels')}
            </li>
            <li
              className={section === Section.ESTATES ? 'sub active' : 'sub'}
              onClick={() => handleSectionChange(Section.ESTATES)}
            >
              {t('categories_menu.estates')}
            </li>
          </>
        ) : null}
        <li
          className={section === Section.WEARABLES ? 'active' : ''}
          onClick={() => handleSectionChange(Section.WEARABLES)}
        >
          {t('categories_menu.wearables')}
        </li>
        {[
          Section.WEARABLES,
          Section.WEARABLES_TOP,
          Section.WEARABLES_BOTTOM,
          Section.WEARABLES_SHOES,
          Section.WEARABLES_ACCESORIES
        ].includes(section) ? (
          <>
            <li
              className={
                section === Section.WEARABLES_TOP ? 'sub active' : 'sub'
              }
              onClick={() => handleSectionChange(Section.WEARABLES)}
            >
              {t('categories_menu.wearables_top')}
            </li>
          </>
        ) : null}
      </ul>
    </div>
  )
}

export default React.memo(CategoriesMenu)
