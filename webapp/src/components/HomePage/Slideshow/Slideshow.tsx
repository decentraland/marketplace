import React from 'react'
import { HeaderMenu, Header, Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTCard } from '../../NFTCard'
import { Props } from './Slideshow.types'
import './Slideshow.css'

const Slideshow = (props: Props) => {
  const { title, nfts, onViewAll } = props
  return (
    <div className="Slideshow">
      <HeaderMenu>
        <HeaderMenu.Left>
          <Header>{title}</Header>
        </HeaderMenu.Left>
        <HeaderMenu.Right>
          <Button basic onClick={onViewAll}>
            {t('home_page.view_all')}
            <i className="caret" />
          </Button>
        </HeaderMenu.Right>
      </HeaderMenu>
      <div className="nfts">
        {nfts.map(nft => (
          <NFTCard nft={nft} />
        ))}
      </div>
    </div>
  )
}

export default React.memo(Slideshow)
