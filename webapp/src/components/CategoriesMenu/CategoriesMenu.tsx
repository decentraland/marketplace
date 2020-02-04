import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { Section } from '../../modules/routing/search'
import { MenuItem } from './MenuItem'
import { Props } from './CategoriesMenu.types'
import './CategoriesMenu.css'

const CategoriesMenu = (props: Props) => {
  const { section, onNavigate } = props

  const renderParentMenuItem = (menuSection: Section) =>
    renderMenuItem(menuSection, false)
  const renderChildMenuItem = (menuSection: Section) =>
    renderMenuItem(menuSection, true)

  const renderMenuItem = (menuSection: Section, isSub: boolean) => (
    <MenuItem
      section={menuSection}
      currentSection={section}
      onNavigate={onNavigate}
      isSub={isSub}
    />
  )

  return (
    <div className="CategoriesMenu">
      <Header sub>{t('categories_menu.categories')}</Header>
      <ul className="menu">
        {renderParentMenuItem(Section.ALL)}
        {renderParentMenuItem(Section.LAND)}

        {[Section.LAND, Section.PARCELS, Section.ESTATES].includes(section) ? (
          <>
            {renderChildMenuItem(Section.PARCELS)}
            {renderChildMenuItem(Section.ESTATES)}
          </>
        ) : null}

        {renderParentMenuItem(Section.WEARABLES)}
        {[
          Section.WEARABLES,
          Section.WEARABLES_TOP,
          Section.WEARABLES_BOTTOM,
          Section.WEARABLES_SHOES,
          Section.WEARABLES_ACCESORIES,
          Section.WEARABLES_EYEWEAR,
          Section.WEARABLES_EARRING,
          Section.WEARABLES_MASK,
          Section.WEARABLES_HAT,
          Section.WEARABLES_HELMET
        ].includes(section) ? (
          <>
            {renderChildMenuItem(Section.WEARABLES_TOP)}
            {renderChildMenuItem(Section.WEARABLES_BOTTOM)}
            {renderChildMenuItem(Section.WEARABLES_SHOES)}
            {renderChildMenuItem(Section.WEARABLES_ACCESORIES)}
            <ul className="submenu">
              {[
                Section.WEARABLES_ACCESORIES,
                Section.WEARABLES_EYEWEAR,
                Section.WEARABLES_EARRING,
                Section.WEARABLES_MASK,
                Section.WEARABLES_HAT,
                Section.WEARABLES_HELMET
              ].includes(section) ? (
                <>
                  {renderChildMenuItem(Section.WEARABLES_EYEWEAR)}
                  {renderChildMenuItem(Section.WEARABLES_EARRING)}
                  {renderChildMenuItem(Section.WEARABLES_MASK)}
                  {renderChildMenuItem(Section.WEARABLES_HAT)}
                  {renderChildMenuItem(Section.WEARABLES_HELMET)}
                </>
              ) : null}
            </ul>
          </>
        ) : null}
      </ul>
    </div>
  )
}

export default React.memo(CategoriesMenu)
