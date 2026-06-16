import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const IAP_VIEW_PARAM = 'view'
const IAP_VIEW_VALUE = 'mobile-iap'

export const useIsIAP = (): boolean => {
  const { search } = useLocation()
  return useMemo(() => {
    const params = new URLSearchParams(search)
    return params.get(IAP_VIEW_PARAM) === IAP_VIEW_VALUE
  }, [search])
}
