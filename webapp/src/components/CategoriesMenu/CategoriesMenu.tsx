import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { Section } from '../../modules/routing/search'
import { MenuItem } from './MenuItem'
import { Props } from './CategoriesMenu.types'
import './CategoriesMenu.css'

const CategoriesMenu = (props: Props) => {
  const { section, onNavigate } = props

  return (
    <div className="CategoriesMenu">
      <Header sub>{t('categories_menu.categories')}</Header>
      <ul className="menu">
        <MenuItem
          section={Section.ALL}
          currentSection={section}
          onNavigate={onNavigate}
        />
        <MenuItem
          section={Section.LAND}
          currentSection={section}
          onNavigate={onNavigate}
        />

        {[Section.LAND, Section.PARCELS, Section.ESTATES].includes(section) ? (
          <>
            <MenuItem
              section={Section.PARCELS}
              currentSection={section}
              onNavigate={onNavigate}
              isSub
            />
            <MenuItem
              section={Section.ESTATES}
              currentSection={section}
              onNavigate={onNavigate}
              isSub
            />
          </>
        ) : null}
        <MenuItem
          section={Section.WEARABLES}
          currentSection={section}
          onNavigate={onNavigate}
        />
        {[
          Section.WEARABLES,
          Section.WEARABLES_TOP,
          Section.WEARABLES_BOTTOM,
          Section.WEARABLES_SHOES,
          Section.WEARABLES_ACCESORIES
        ].includes(section) ? (
          <>
            <MenuItem
              section={Section.WEARABLES_TOP}
              currentSection={section}
              onNavigate={onNavigate}
              isSub
            />
          </>
        ) : null}
      </ul>
    </div>
  )
}

export default React.memo(CategoriesMenu)
