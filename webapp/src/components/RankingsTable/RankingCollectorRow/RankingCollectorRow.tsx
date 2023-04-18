import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader, Mana, Mobile, NotMobile, Table } from 'decentraland-ui'
import { Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatWeiMANA } from '../../../lib/mana'
import { locations } from '../../../modules/routing/locations'
import { ManaToFiat } from '../../ManaToFiat'
import { LinkedProfile } from '../../LinkedProfile'
import { Props } from './RankingCollectorRow.types'
import './RankingCollectorRow.css'

const RankingCollectorRow = ({ entity }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const renderMobile = () => {
    const collectorAddress = entity.id
    return (
      <div className="RankingCollectorRow rankings-collector-cell">
        <div>
          <div className="rankings-collector-data">
            <Link to={locations.account(collectorAddress)}>
              <LinkedProfile
                address={collectorAddress}
                inline={false}
                size="large"
              />
            </Link>
            <span className="rankings-collector-items-collected">
              {t('home_page.analytics.rankings.collectors.collected_items', {
                amount: entity.purchases
              })}
            </span>
          </div>
          <div className="rankings-collector-right-data">
            <>
              <Mana showTooltip network={Network.MATIC} inline>
                {entity.spent && formatWeiMANA(entity.spent)}
              </Mana>
              <span className="rankings-fiat-price">
                {entity.spent && (
                  <>
                    (<ManaToFiat mana={entity.spent} />)
                  </>
                )}
              </span>
              <div
                className="arrow-container"
                onClick={() => setExpanded(!expanded)}
              >
                <span> {t(`global.${expanded ? 'less' : 'more'}`)} </span>
                <i className={`caret back ${expanded ? 'up' : ''}`} />
              </div>
            </>
          </div>
        </div>
        {expanded ? (
          <div>
            <div className="rankings-collector-more-data-container">
              <div>
                <span>
                  {t(
                    'home_page.analytics.rankings.collectors.unique_items_bought'
                  )}
                </span>
                {entity.uniqueAndMythicItems}
              </div>
              <div>
                <span>
                  {t(
                    'home_page.analytics.rankings.collectors.creators_supported'
                  )}
                </span>
                {entity.creatorsSupported}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  const renderNotMobile = () => {
    const collectorAddress = entity.id
    return (
      <Table.Row key={entity.id} className="RankingCollectorRow">
        {!entity ? (
          <Loader active inline />
        ) : (
          <>
            <Table.Cell width={4}>
              <div className="rankings-collector-cell">
                <LinkedProfile
                  address={collectorAddress}
                  inline={false}
                  size="large"
                />
              </div>
            </Table.Cell>
            <Table.Cell width={2}>{entity.purchases}</Table.Cell>
            <Table.Cell width={3}>{entity.creatorsSupported}</Table.Cell>
            <Table.Cell width={4}>{entity.uniqueAndMythicItems}</Table.Cell>
            <Table.Cell>
              <Mana showTooltip network={Network.MATIC} inline>
                {entity.spent && formatWeiMANA(entity.spent)}
              </Mana>
              <span className="rankings-fiat-price">
                {entity.spent && (
                  <>
                    (<ManaToFiat mana={entity.spent} />)
                  </>
                )}
              </span>
            </Table.Cell>
          </>
        )}
      </Table.Row>
    )
  }

  return (
    <>
      <Mobile>{renderMobile()}</Mobile>
      <NotMobile>{renderNotMobile()}</NotMobile>
    </>
  )
}

export default React.memo(RankingCollectorRow)
