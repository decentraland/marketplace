import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Section, Sections } from '../vendor/routing/types'
import { View } from './types'

const accountViews = new Set<View>([View.ACCOUNT, View.CURRENT_ACCOUNT])
const landSections = new Set<Section>([
  Sections.decentraland.LAND,
  Sections.decentraland.PARCELS,
  Sections.decentraland.ESTATES
])

export const isAccountView = (view: View) => accountViews.has(view)
export const isListsSection = (section?: Section) =>
  Sections.decentraland.LISTS === section
export const isLandSection = (section?: Section) =>
  !!section && landSections.has(section)

export const useScrollSectionIntoView = <T>(
  ref: React.RefObject<HTMLDivElement>,
  prefix: string,
  setter?: (value: T) => void,
  behavior?: ScrollBehavior
) => {
  const location = useLocation()
  useEffect(() => {
    if (location.hash && location.hash.includes(prefix)) {
      ref.current?.scrollIntoView({ behavior: behavior || 'smooth' })
      setter?.((location.hash.replace(prefix, '') as unknown) as T)
    }
    // we only want this behavior after the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const PERSISTED_IS_MAP_STORAGE_KEY = 'is-map'

export const persistIsMapProperty = (val: boolean) => {
  localStorage.setItem(PERSISTED_IS_MAP_STORAGE_KEY, val.toString())
}

export const getPersistedIsMapProperty = (): boolean | null => {
  const persistedIsMapProperty =
    localStorage.getItem(PERSISTED_IS_MAP_STORAGE_KEY) || ''

  if (['true', 'false'].includes(persistedIsMapProperty)) {
    return persistedIsMapProperty === 'true'
  }

  return null
}
