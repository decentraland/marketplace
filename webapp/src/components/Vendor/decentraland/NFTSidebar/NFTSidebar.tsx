import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { NFTSections } from '../NFTSections'
import { Props } from './NFTSidebar.types'
import './NFTSidebar.css'

const NFTSidebar = (props: Props) => {
  const { section, sections, onMenuItemClick } = props

  return (
    <div className="NFTSidebar">
      <Header sub>{t('nft_sidebar.categories')}</Header>
      <NFTSections
        section={section}
        sections={sections}
        onSectionClick={onMenuItemClick}
      />
    </div>
  )
}

export default React.memo(NFTSidebar)
