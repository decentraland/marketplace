import React, { useCallback } from 'react'

import { Section } from '../../modules/routing/search'
import { useNavigate } from '../../modules/nft/hooks'
import { CategoriesSidebar } from './CategoriesSidebar'
import { Props } from './NFTSidebar.types'

const NFTSidebar = (props: Props) => {
  const { section } = props
  const [navigate] = useNavigate()

  const handleOnNavigate = useCallback(
    (section: Section) => {
      navigate({ section: section })
    },
    [navigate]
  )

  return (
    <CategoriesSidebar section={section} onMenuItemClick={handleOnNavigate} />
  )
}

export default React.memo(NFTSidebar)
