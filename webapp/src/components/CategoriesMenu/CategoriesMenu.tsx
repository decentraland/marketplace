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
                isSub={true}
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
          Section.WEARABLES_EYEBROWS,
          Section.WEARABLES_EYES,
          Section.WEARABLES_FACIAL_HAIR,
          Section.WEARABLES_HAIR,
          Section.WEARABLES_MOUTH,
          Section.WEARABLES_UPPER_BODY,
          Section.WEARABLES_LOWER_BODY,
          Section.WEARABLES_FEET,
          Section.WEARABLES_ACCESORIES,
          Section.WEARABLES_EARRING,
          Section.WEARABLES_HAT,
          Section.WEARABLES_HELMET,
          Section.WEARABLES_MASK,
          Section.WEARABLES_TIARA,
          Section.WEARABLES_TOP_HEAD
        ].includes(section) ? (
          <>
            <MenuItem
              key={Section.WEARABLES_HEAD}
              section={Section.WEARABLES_HEAD}
              currentSection={section}
              onNavigate={onNavigate}
              isSub={true}
              withCaret={true}
            />
            <ul className="submenu">
              {[
                Section.WEARABLES_HEAD,
                Section.WEARABLES_EYEBROWS,
                Section.WEARABLES_EYES,
                Section.WEARABLES_FACIAL_HAIR,
                Section.WEARABLES_HAIR,
                Section.WEARABLES_MOUTH
              ].includes(section)
                ? [
                    Section.WEARABLES_EYEBROWS,
                    Section.WEARABLES_EYES,
                    Section.WEARABLES_FACIAL_HAIR,
                    Section.WEARABLES_HAIR,
                    Section.WEARABLES_MOUTH
                  ].map(menuSection => (
                    <MenuItem
                      key={menuSection}
                      section={menuSection}
                      currentSection={section}
                      onNavigate={onNavigate}
                      isSub={true}
                    />
                  ))
                : null}
            </ul>

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
                isSub={true}
              />
            ))}

            <MenuItem
              section={Section.WEARABLES_ACCESORIES}
              currentSection={section}
              onNavigate={onNavigate}
              isSub={true}
              withCaret={true}
            />
            <ul className="submenu">
              {[
                Section.WEARABLES_ACCESORIES,
                Section.WEARABLES_EARRING,
                Section.WEARABLES_HAT,
                Section.WEARABLES_HELMET,
                Section.WEARABLES_MASK,
                Section.WEARABLES_TIARA,
                Section.WEARABLES_TOP_HEAD
              ].includes(section)
                ? [
                    Section.WEARABLES_EARRING,
                    Section.WEARABLES_HAT,
                    Section.WEARABLES_HELMET,
                    Section.WEARABLES_MASK,
                    Section.WEARABLES_TIARA,
                    Section.WEARABLES_TOP_HEAD
                  ].map(menuSection => (
                    <MenuItem
                      key={menuSection}
                      section={menuSection}
                      currentSection={section}
                      onNavigate={onNavigate}
                      isSub={true}
                    />
                  ))
                : null}
            </ul>
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
