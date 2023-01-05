import { useCallback, useMemo } from 'react'
import { Box, Radio } from 'decentraland-ui'
import { GenderFilterOption } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AVAILABLE_FOR_FEMALE, AVAILABLE_FOR_MALE, getBodyShapeValue } from './utils'
import './BodyShapeFilter.css'

export type BodyShapeFilterProps = {
  bodyShapes?: GenderFilterOption[]
  onChange: (value: GenderFilterOption[]) => void
}

export const BodyShapeFilter = ({
  bodyShapes,
  onChange
}: BodyShapeFilterProps) => {
  const genderOptions = useMemo(() => {
    return [
      {
        value: undefined,
        text: t('nft_filters.body_shapes.all_items')
      },
      {
        value: AVAILABLE_FOR_FEMALE,
        text:  t("nft_filters.body_shapes.available_for_female")
      },
      {
        value: AVAILABLE_FOR_MALE,
        text:  t("nft_filters.body_shapes.available_for_male")
      }
    ]
  }, [])

  const handleChange = useCallback(
    (_evt, { value }) => {
      let newValue: GenderFilterOption[] = [];

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

  return (
    <Box
      header={t('nft_filters.body_shapes.title')}
      className="filters-sidebar-box body-shape-filter"
      collapsible
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
