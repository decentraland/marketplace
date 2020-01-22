import React from 'react'
import { Header } from 'decentraland-ui'
import './Highlights.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

const Highlights = (props: { children: React.ReactNode }) => {
  return (
    <div className="Highlights">
      <Header sub>{t('detail.highlights')}</Header>
      <div className="row">{props.children}</div>
    </div>
  )
}

export default React.memo(Highlights)
