import { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box, CheckboxProps, Checkbox, useTabletAndBelowMediaQuery, SliderField } from 'decentraland-ui'
import styles from './LocationFilter.module.css'

export const DISTANCE_TO_PLAZA_MIN = 1
export const DISTANCE_TO_PLAZA_MAX = 10

export type LocationFilterProps = {
  adjacentToRoad?: boolean
  minDistanceToPlaza?: string
  maxDistanceToPlaza?: string
  defaultCollapsed?: boolean
  onAdjacentToRoadChange: (value?: boolean) => void
  onDistanceToPlazaChange: (value: [string, string]) => void
}

export const LocationFilter = ({
  adjacentToRoad,
  minDistanceToPlaza,
  maxDistanceToPlaza,
  defaultCollapsed = false,
  onAdjacentToRoadChange,
  onDistanceToPlazaChange
}: LocationFilterProps): JSX.Element => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const handleAdjacentToRoadChange = useCallback(
    (_evt, props: CheckboxProps) => {
      onAdjacentToRoadChange(!!props.checked || undefined)
    },
    [onAdjacentToRoadChange]
  )

  const handleDistanceToPlazaChange = useCallback(
    (_evt, data: readonly [number, number]) => {
      onDistanceToPlazaChange([data[0].toString(), data[1].toString()])
    },
    [onDistanceToPlazaChange]
  )

  const handleToggleDistanceFilter = useCallback(
    (_evt, props: CheckboxProps) => {
      if (props.checked) {
        onDistanceToPlazaChange([DISTANCE_TO_PLAZA_MIN.toString(), DISTANCE_TO_PLAZA_MAX.toString()])
      } else {
        onDistanceToPlazaChange(['', ''])
      }
    },
    [onDistanceToPlazaChange]
  )

  const locationSelectionText = useMemo(() => {
    if (!adjacentToRoad && !minDistanceToPlaza && !maxDistanceToPlaza) {
      return t('nft_filters.all_locations')
    }

    const locationTexts = []
    if (adjacentToRoad) {
      locationTexts.push(t('nft_filters.adjacent_to_road'))
    }

    if (minDistanceToPlaza || maxDistanceToPlaza) {
      locationTexts.push(t('nft_filters.distance_to_plaza.title'))
    }

    return locationTexts.join(', ')
  }, [minDistanceToPlaza, maxDistanceToPlaza, adjacentToRoad])

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('nft_filters.location')}</span>
          <span className="box-filter-value">{locationSelectionText}</span>
        </div>
      ) : (
        t('nft_filters.location')
      ),
    [isMobileOrTablet, locationSelectionText]
  )

  const distanceFilterIsOn = !!(minDistanceToPlaza || maxDistanceToPlaza)

  return (
    <Box
      header={header}
      className={classNames('filters-sidebar-box', styles.locationContainer)}
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <Checkbox
        data-testid="adjacent-to-road-toggle"
        id="adjacent-to-road-toggle"
        label={t('nft_filters.adjacent_to_road')}
        toggle
        checked={adjacentToRoad}
        onChange={handleAdjacentToRoadChange}
        className={styles.checkboxFilter}
      />
      <Checkbox
        data-testid="near-to-plaza-toggle"
        id="near-to-plaza-toggle"
        label={t('nft_filters.distance_to_plaza.title')}
        toggle
        checked={distanceFilterIsOn}
        onChange={handleToggleDistanceFilter}
      />
      {distanceFilterIsOn && (
        <SliderField
          data-testid="dkstance-to-plaza-slider"
          min={DISTANCE_TO_PLAZA_MIN}
          max={DISTANCE_TO_PLAZA_MAX}
          onChange={handleDistanceToPlazaChange}
          step={1}
          valueFrom={minDistanceToPlaza ? Number.parseFloat(minDistanceToPlaza) : undefined}
          valueTo={maxDistanceToPlaza ? Number.parseFloat(maxDistanceToPlaza) : undefined}
          range
          header=""
          label={t('nft_filters.distance_to_plaza.subtitle')}
          className={styles.slider}
        />
      )}
    </Box>
  )
}
