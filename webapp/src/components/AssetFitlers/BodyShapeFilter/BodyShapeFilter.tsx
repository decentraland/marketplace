import { useCallback, useMemo } from 'react'
import { Box, Radio } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { WearableGender } from '../../../modules/nft/wearable/types'
import './BodyShapeFilter.css'

const UNISEX_VALUE = 'UNISEX'

export type BodyShapeFilterProps = {
  bodyShapes?: WearableGender[]
  onChange: (value: WearableGender[]) => void
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
      ...Object.values(WearableGender).map(bodyShape => ({
        value: bodyShape,
        text: t(`nft_filters.body_shapes.${bodyShape}`)
      })),
      {
        value: UNISEX_VALUE,
        text: t('nft_filters.body_shapes.unisex')
      }
    ]
  }, [])

  const handleChange = useCallback(
    (_evt, { value }) => {
      let newValue = [value]

      if (value === UNISEX_VALUE) {
        newValue = [WearableGender.FEMALE, WearableGender.MALE]
      }

      onChange(newValue)
    },
    [onChange]
  )

  const value =
    !bodyShapes || !bodyShapes.length
      ? undefined
      : bodyShapes.length === 2
      ? UNISEX_VALUE
      : bodyShapes[0]

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
