import React from 'react'

import { Section } from '../../../../modules/vendor/decentraland/routing/types'
import { Menu } from '../../../Menu'
import { DropdownMenu } from '../../../Menu/DropdownMenu'
import { MenuItem } from '../../../Menu/MenuItem'
import { Props } from './NFTSections.types'

const shouldRenderSection = (section: Section, sections: Section[]) => {
  return sections.includes(section) || sections.includes(Section.ALL)
}

const NFTSections = (props: Props) => {
  const { section, sections, onSectionClick } = props

  return (
    <Menu className="NFTSections">
      {sections.includes(Section.ALL) && (
        <MenuItem
          key={Section.ALL}
          value={Section.ALL}
          currentValue={section}
          onClick={onSectionClick}
        />
      )}
      {shouldRenderSection(Section.LAND, sections) && (
        <>
          <MenuItem
            key={Section.LAND}
            value={Section.LAND}
            currentValue={section}
            onClick={onSectionClick}
          />
          {[Section.LAND, Section.PARCELS, Section.ESTATES].includes(section!)
            ? [Section.PARCELS, Section.ESTATES].map(menuSection => (
                <MenuItem
                  key={menuSection}
                  value={menuSection}
                  currentValue={section}
                  onClick={onSectionClick}
                  nestedLevel={1}
                />
              ))
            : null}
        </>
      )}
      {shouldRenderSection(Section.WEARABLES, sections) && (
        <>
          <MenuItem
            value={Section.WEARABLES}
            currentValue={section}
            onClick={onSectionClick}
          />
          {[
            Section.WEARABLES,
            Section.WEARABLES_HEAD,
            Section.WEARABLES_FACIAL_HAIR,
            Section.WEARABLES_HAIR,
            Section.WEARABLES_EYES,
            Section.WEARABLES_EYEBROWS,
            Section.WEARABLES_MOUTH,
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
          ].includes(section!) ? (
            <>
              <DropdownMenu
                values={[
                  Section.WEARABLES_HEAD,
                  Section.WEARABLES_FACIAL_HAIR,
                  Section.WEARABLES_HAIR,
                  Section.WEARABLES_EYES,
                  Section.WEARABLES_EYEBROWS,
                  Section.WEARABLES_MOUTH
                ]}
                currentValue={section}
                onMenuItemClick={onSectionClick}
              />

              {[
                Section.WEARABLES_UPPER_BODY,
                Section.WEARABLES_LOWER_BODY,
                Section.WEARABLES_FEET
              ].map(menuSection => (
                <MenuItem
                  key={menuSection}
                  value={menuSection}
                  currentValue={section}
                  onClick={onSectionClick}
                  nestedLevel={1}
                />
              ))}

              <DropdownMenu
                values={[
                  Section.WEARABLES_ACCESORIES,
                  Section.WEARABLES_EARRING,
                  Section.WEARABLES_EYEWEAR,
                  Section.WEARABLES_HAT,
                  Section.WEARABLES_HELMET,
                  Section.WEARABLES_MASK,
                  Section.WEARABLES_TIARA,
                  Section.WEARABLES_TOP_HEAD
                ]}
                currentValue={section}
                onMenuItemClick={onSectionClick}
              />
            </>
          ) : null}
        </>
      )}
      {shouldRenderSection(Section.ENS, sections) && (
        <MenuItem
          value={Section.ENS}
          currentValue={section}
          onClick={onSectionClick}
        />
      )}
    </Menu>
  )
}

export default React.memo(NFTSections)
