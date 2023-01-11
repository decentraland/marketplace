import { useCallback, useMemo } from 'react'
import { Box, Radio, useMobileMediaQuery } from 'decentraland-ui'
import { GenderFilterOption, WearableGender } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import './BodyShapeFilter.css'
import {
  AVAILABLE_FOR_FEMALE,
  AVAILABLE_FOR_MALE,
  getBodyShapeValue,
  getGenderFilterLabel
} from '../../../utils/filters'

export type BodyShapeFilterProps = {
  bodyShapes?: (GenderFilterOption | WearableGender)[]
  onChange: (value: (GenderFilterOption | WearableGender)[]) => void
}

export const BodyShapeFilter = ({
  bodyShapes,
  onChange
}: BodyShapeFilterProps) => {
  const isMobile = useMobileMediaQuery()
  const genderOptions = useMemo(() => {
    return [
      {
        value: undefined,
        text: t('nft_filters.body_shapes.all_items')
      },
      {
        value: AVAILABLE_FOR_FEMALE,
        text: t('nft_filters.body_shapes.available_for_female')
      },
      {
        value: AVAILABLE_FOR_MALE,
        text: t('nft_filters.body_shapes.available_for_male')
      }
    ]
  }, [])

  const handleChange = useCallback(
    (_evt, { value }) => {
      let newValue: GenderFilterOption[] = []

      if (value === AVAILABLE_FOR_FEMALE) {
        newValue = [GenderFilterOption.FEMALE, GenderFilterOption.UNISEX]
      } else if (value === AVAILABLE_FOR_MALE) {
        newValue = [GenderFilterOption.MALE, GenderFilterOption.UNISEX]
      }
      onChange(newValue)
    },
    [onChange]
  )

  const value = getBodyShapeValue(bodyShapes)

  const header = useMemo(
    () =>
      isMobile ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">
            {t('nft_filters.body_shapes.title')}
          </span>
          <span className="box-filter-value">
            {value
              ? t(getGenderFilterLabel(bodyShapes))
              : t('nft_filters.body_shapes.all_items')}
          </span>
        </div>
      ) : (
        t('nft_filters.body_shapes.title')
      ),
    [bodyShapes, isMobile, value]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box body-shape-filter"
      collapsible
      defaultCollapsed={isMobile}
    >
      <div className="body-shape-options filters-radio-group">
        {genderOptions.map(option => {
          return (
            <Radio
              type="radio"
              key={option.value || 'all'}
              onChange={handleChange}
              label={option.text}
              value={option.value}
              name="bodyShape"
              checked={option.value === value}
            />
          )
        })}
      </div>
    </Box>
  )
}
