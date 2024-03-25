import * as React from 'react'
import { ethers } from 'ethers'
import { Profile } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Row, Section, Header, HeaderSubheader } from 'decentraland-ui'
import { formatWeiMANA } from '../../../lib/mana'
import { Coordinate } from '../../Coordinate'
import { Mana } from '../../Mana'
import { Props } from './Popup.types'
import './Popup.css'

export default class Popup extends React.PureComponent<Props> {
  subPriceHeader() {
    const { tile } = this.props
    if (tile.price && tile.rentalPricePerDay) {
      return t('atlas.for_sale_and_rent')
    } else if (tile.price) {
      return t('atlas.for_sale')
    }
    return t('atlas.for_rent')
  }

  render() {
    const { x, y, visible, tile, position } = this.props
    const isEstate = !!tile.estate_id

    return (
      <div
        className={`AtlasPopup ${position} ${tile.owner ? 'has-owner' : 'no-owner'}`}
        style={{ top: y, left: x, opacity: visible ? 1 : 0 }}
      >
        <Section className="land-name">
          <Row className="name-row">
            <span className="name">{tile.name || (!isEstate ? t('global.parcel') : t('global.estate'))}</span>
            <Coordinate className="coordinates" x={tile.x} y={tile.y} />
          </Row>
        </Section>

        <Section className="owner">
          <Header sub>{t('atlas.owner')}</Header>
          <Profile address={tile.owner || ethers.constants.AddressZero} debounce={500} as={'div'} />
        </Section>

        {tile.price || tile.rentalPricePerDay ? (
          <Section className="price">
            <Header sub>{t('atlas.price')}</Header>
            <HeaderSubheader>{this.subPriceHeader()}</HeaderSubheader>
            <div className={'prices'}>
              {tile.price ? <Mana>{tile.price.toLocaleString()}</Mana> : null}
              {tile.rentalPricePerDay ? (
                <>
                  <Mana>{formatWeiMANA(tile.rentalPricePerDay)}</Mana>
                  <span className="rental-day">/{t('global.day')}</span>
                </>
              ) : null}
            </div>
          </Section>
        ) : null}
      </div>
    )
  }
}
