import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'
import { Menu } from '../../../Menu'
import NFTSectionsMenuItems from './NFTSectionsMenuItems'
import { Props } from './NFTSections.types'

const NFTSections = (props: Props) => {
  return (
    <Menu className="NFTSections box-menu">
      <Header sub>{t('nft_sidebar.categories')}</Header>
      <NFTSectionsMenuItems {...props} />
    </Menu>
  )
}

export default React.memo(NFTSections)
