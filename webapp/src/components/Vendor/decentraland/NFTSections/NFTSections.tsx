import React from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Menu } from '../../../Menu'
import { Props } from './NFTSections.types'
import NFTSectionsMenuItems from './NFTSectionsMenuItems'

const NFTSections = (props: Props) => {
  return (
    <Menu className="NFTSections box-menu">
      <Header sub>{t('nft_sidebar.categories')}</Header>
      <NFTSectionsMenuItems {...props} />
    </Menu>
  )
}

export default React.memo(NFTSections)
