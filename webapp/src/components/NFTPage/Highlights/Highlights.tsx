import React from 'react'
import { Header, Row } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import './Highlights.css'

const Highlights = (props: { children: React.ReactNode }) => {
  return (
    <div className="Highlights">
      <Header sub>{t('detail.highlights')}</Header>
      <Row>{props.children}</Row>
    </div>
  )
}

export default React.memo(Highlights)
