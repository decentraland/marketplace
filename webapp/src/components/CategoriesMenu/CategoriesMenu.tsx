import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { Section } from '../../modules/routing/search'
import { DropdownMenu } from './DropdownMenu'
import { MenuItem } from './MenuItem'
import { Props } from './CategoriesMenu.types'
import './CategoriesMenu.css'

const CategoriesMenu = (props: Props) => {
  const { section, onNavigate } = props

  return (
    <div className="CategoriesMenu">
      <Header sub>{t('categories_menu.categories')}</Header>
      <ul className="menu">
        {[Section.ALL, Section.LAND].map(menuSection => (
          <MenuItem
            key={menuSection}
            section={menuSection}
            currentSection={section}
            onNavigate={onNavigate}
          />
        ))}

        {[Section.LAND, Section.PARCELS, Section.ESTATES].includes(section)
          ? [Section.PARCELS, Section.ESTATES].map(menuSection => (
              <MenuItem
                key={menuSection}
                section={menuSection}
                currentSection={section}
                onNavigate={onNavigate}
                isSub
              />
            ))
          : null}

        <MenuItem
          section={Section.WEARABLES}
          currentSection={section}
          onNavigate={onNavigate}
        />
        {[
          Section.WEARABLES,
          Section.WEARABLES_HEAD,
          Section.WEARABLES_FACIAL_HAIR,
          Section.WEARABLES_HAIR,
          Section.WEARABLES_UPPER_BODY,
          Section.WEARABLES_LOWER_BODY,
          Section.WEARABLES_FEET,
          Section.WEARABLES_ACCESORIES,
          Section.WEARABLES_EARRING,
          Section.WEARABLES_EYEWEAR,
          Section.WEARABLES_HAT,
          Section.WEARABLES_HELMET,
          Section.WEARABLES_MASK,
          Section.WEARABLES_TIARA,
          Section.WEARABLES_TOP_HEAD
        ].includes(section) ? (
          <>
            <DropdownMenu
              sections={[
                Section.WEARABLES_HEAD,
                Section.WEARABLES_FACIAL_HAIR,
                Section.WEARABLES_HAIR
              ]}
              currentSection={section}
              onNavigate={onNavigate}
            />

            {[
              Section.WEARABLES_UPPER_BODY,
              Section.WEARABLES_LOWER_BODY,
              Section.WEARABLES_FEET
            ].map(menuSection => (
              <MenuItem
                key={menuSection}
                section={menuSection}
                currentSection={section}
                onNavigate={onNavigate}
                isSub
              />
            ))}

            <DropdownMenu
              sections={[
                Section.WEARABLES_ACCESORIES,
                Section.WEARABLES_EARRING,
                Section.WEARABLES_EYEWEAR,
                Section.WEARABLES_HAT,
                Section.WEARABLES_HELMET,
                Section.WEARABLES_MASK,
                Section.WEARABLES_TIARA,
                Section.WEARABLES_TOP_HEAD
              ]}
              currentSection={section}
              onNavigate={onNavigate}
            />
          </>
        ) : null}

        <MenuItem
          section={Section.ENS}
          currentSection={section}
          onNavigate={onNavigate}
        />
      </ul>
    </div>
  )
}

export default React.memo(CategoriesMenu)
