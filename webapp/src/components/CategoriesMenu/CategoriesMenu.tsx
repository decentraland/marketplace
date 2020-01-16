import React, { useCallback } from 'react'
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
          All Assets
        </li>
        <li
          className={section === MarketSection.LAND ? 'active' : ''}
          onClick={() => handleSectionChange(MarketSection.LAND)}
        >
          Land
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
              Estates
            </li>
          </>
        ) : null}
        <li
          className={section === MarketSection.WEARABLES ? 'active' : ''}
          onClick={() => handleSectionChange(MarketSection.WEARABLES)}
        >
          Wearables
        </li>
      </ul>
    </div>
  )
}

export default React.memo(CategoriesMenu)
