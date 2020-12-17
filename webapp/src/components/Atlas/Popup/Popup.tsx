import * as React from 'react'
import { Badge, Row, Section, Header, Mana } from 'decentraland-ui'
// import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import Profile from '../../Profile'
import { Props } from './Popup.types'
import './Popup.css'

export default class Popup extends React.PureComponent<Props> {
  render() {
    const { x, y, visible, tile, position } = this.props
    const id = `${tile.x},${tile.y}`
    const isEstate = !!tile.estate_id
    return (
      <div
        className={`Popup ${position}`}
        style={{ top: y, left: x, opacity: visible ? 1 : 0 }}
      >
        <Section className="land-name">
          <Row className="name-row">
            <span className="name">
              {tile.name || (!isEstate ? `Parcel` : `Estate`)}
            </span>
            <Badge color="#37333D">
              <i className="pin" />
              {id}
            </Badge>
          </Row>
        </Section>

        {tile.owner ? (
          <Section className="owner">
            <Header sub>Owner</Header>
            <Profile address={tile.owner} />
          </Section>
        ) : null}

        {tile.price ? (
          <Section className="price">
            <Header sub>Price</Header>
            <Mana>{tile.price.toLocaleString()}</Mana>
          </Section>
        ) : null}
      </div>
    )
  }
}
