import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { Props } from './CategoriesMenu.types'
import { locations, MarketSection } from '../../modules/routing/locations'
import './CategoriesMenu.css'

const CategoriesMenu = (props: Props) => {
  const { section, onNavigate } = props

  const handleSectionChange = useCallback(
    (section: MarketSection) => {
      onNavigate(
        locations.market({
          page: 1,
          section
        })
      )
    },
    [onNavigate]
  )

  return (
    <div className="CategoriesMenu">
      <Header sub>Categories</Header>
      <ul className="menu">
        <li
          className={section === MarketSection.ALL ? 'active' : ''}
          onClick={() => handleSectionChange(MarketSection.ALL)}
        >
          {t('categories_menu.all_assets')}
        </li>
        <li
          className={section === MarketSection.LAND ? 'active' : ''}
          onClick={() => handleSectionChange(MarketSection.LAND)}
        >
          {t('categories_menu.land')}
        </li>
        {[
          MarketSection.LAND,
          MarketSection.PARCELS,
          MarketSection.ESTATES
        ].includes(section) ? (
          <>
            {' '}
            <li
              className={
                section === MarketSection.PARCELS ? 'sub active' : 'sub'
              }
              onClick={() => handleSectionChange(MarketSection.PARCELS)}
            >
              Parcels
            </li>
            <li
              className={
                section === MarketSection.ESTATES ? 'sub active' : 'sub'
              }
              onClick={() => handleSectionChange(MarketSection.ESTATES)}
            >
              {t('categories_menu.estates')}
            </li>
          </>
        ) : null}
        <li
          className={section === MarketSection.WEARABLES ? 'active' : ''}
          onClick={() => handleSectionChange(MarketSection.WEARABLES)}
        >
          {t('categories_menu.wearables')}
        </li>
      </ul>
    </div>
  )
}

export default React.memo(CategoriesMenu)
