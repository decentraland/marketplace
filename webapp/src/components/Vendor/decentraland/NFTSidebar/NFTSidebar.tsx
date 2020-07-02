import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { Section } from '../../../../modules/vendor/decentraland/routing/types'
import { Menu } from '../../../Menu'
import { DropdownMenu } from '../../../Menu/DropdownMenu'
import { MenuItem } from '../../../Menu/MenuItem'
import { Props } from './NFTSidebar.types'

const NFTSidebar = (props: Props) => {
  const { section, onMenuItemClick } = props

  return (
    <div className="NFTSidebar">
      <Header sub>{t('nft_sidebar.categories')}</Header>
      <Menu>
        {[Section.ALL, Section.LAND].map(menuSection => (
          <MenuItem
            key={menuSection}
            value={menuSection}
            currentValue={section}
            onClick={onMenuItemClick}
          />
        ))}

        {[Section.LAND, Section.PARCELS, Section.ESTATES].includes(section)
          ? [Section.PARCELS, Section.ESTATES].map(menuSection => (
              <MenuItem
                key={menuSection}
                value={menuSection}
                currentValue={section}
                onClick={onMenuItemClick}
                isSub
              />
            ))
          : null}

        <MenuItem
          value={Section.WEARABLES}
          currentValue={section}
          onClick={onMenuItemClick}
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
              values={[
                Section.WEARABLES_HEAD,
                Section.WEARABLES_FACIAL_HAIR,
                Section.WEARABLES_HAIR
              ]}
              currentValue={section}
              onMenuItemClick={onMenuItemClick as any}
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
                onClick={onMenuItemClick}
                isSub
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
              onMenuItemClick={onMenuItemClick}
            />
          </>
        ) : null}

        <MenuItem
          value={Section.ENS}
          currentValue={section}
          onClick={onMenuItemClick}
        />
      </Menu>
    </div>
  )
}

export default React.memo(NFTSidebar)
