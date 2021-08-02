import React from 'react'
import { HeaderMenu, Header, Button, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetCard } from '../../AssetCard'
import { Props } from './Slideshow.types'
import './Slideshow.css'

const Slideshow = (props: Props) => {
  const { title, assets, isSubHeader, isLoading, onViewAll } = props

  const renderNfts = () =>
    assets.map((asset, index) => <AssetCard key={index} asset={asset} />)

  return (
    <div className="Slideshow">
      <HeaderMenu>
        <HeaderMenu.Left>
          <Header sub={isSubHeader}>{title}</Header>
        </HeaderMenu.Left>
        <HeaderMenu.Right>
          <Button basic onClick={onViewAll}>
            {t('slideshow.view_all')}
            <i className="caret" />
          </Button>
        </HeaderMenu.Right>
      </HeaderMenu>
      <div className="assets">
        {isLoading ? (
          assets.length === 0 ? (
            <Loader active size="massive" />
          ) : (
            renderNfts()
          )
        ) : assets.length > 0 ? (
          renderNfts()
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(Slideshow)
