import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { POST_MORTEM_URL } from './utils'

const LearnMoreLink = ({ className }: { className?: string }) => (
  <a href={POST_MORTEM_URL} target="_blank" rel="noopener noreferrer" className={className}>
    {t('cancelled_orders_banner.learn_more')}
  </a>
)

export default React.memo(LearnMoreLink)
