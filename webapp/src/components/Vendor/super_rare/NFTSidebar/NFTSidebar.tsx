import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { Image } from 'decentraland-ui'

import { locations } from '../../../../modules/routing/locations'
import { Vendors } from '../../../../modules/vendor/types'
import { Menu } from '../../../Menu'
import { MenuItem } from '../../../Menu/MenuItem'
import { Props } from './NFTSidebar.types'

const NFTSidebar = (props: Props) => {
  const { section, onMenuItemClick, onNavigate } = props

  const handleGoBack = useCallback(() => {
    onNavigate(locations.partners())
  }, [onNavigate])

  const vendor = Vendors.SUPER_RARE

  // TODO: The first MenuItem should be extracted to reuse on partners
  return (
    <div className="NFTSidebar">
      <div className="go-back" onClick={handleGoBack}>
        <i className="back icon" />
        back
      </div>

      <Menu>
        <li className="MenuItem active partner">
          <Image
            alt={vendor}
            src={`/${vendor}.png`}
            width="50"
            spaced="right"
            circular
          />
          <div className="partner-data">{t(`vendors.${vendor}`)}</div>
        </li>
        <MenuItem value={section} onClick={onMenuItemClick} />
      </Menu>
    </div>
  )
}

export default React.memo(NFTSidebar)
