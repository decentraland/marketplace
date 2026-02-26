import React from 'react'
import { useSelector } from 'react-redux'
import { getIsCreditsEnabled } from '../../../modules/features/selectors'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import { SpecialFilter } from './SpecialFilter'
import { ContainerProps } from './SpecialFilter.types'

export const SpecialFilterContainer: React.FC<ContainerProps> = props => {
  const { onlySmart, withCredits } = useGetBrowseOptions()

  const isCreditsEnabled = useSelector(getIsCreditsEnabled)

  return (
    <SpecialFilter
      {...props}
      isOnlySmart={props.isOnlySmart !== undefined ? props.isOnlySmart : onlySmart} // if the isOnlySmart is undefined, use the value from the browse options
      withCredits={props.withCredits !== undefined ? props.withCredits : withCredits} // if the withCredits is undefined, use the value from the browse options
      isCreditsEnabled={isCreditsEnabled}
    />
  )
}

export default SpecialFilterContainer
