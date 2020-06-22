import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'

import { Props } from './ClearFilters.types'
import './ClearFilters.css'

const ClearFilters = (props: Props) => {
  const { filters, onClear } = props

  let name = ''
  if (filters.length === 1) {
    name = filters[0]
    // "RARITY, GENDER (X)" on desktop, "2 FILTERS (X)" on mobile
  } else if (filters.length === 2 && !isMobile()) {
    name = filters.join(', ')
  } else if (filters.length > 1) {
    name = t('nft_list_page.multiple_filters', {
      count: filters.length
    })
  }

  return (
    <div className="ClearFilters" onClick={onClear}>
      <div className="name">{name}</div>
      <div className="close" />
    </div>
  )
}

export default React.memo(ClearFilters)
