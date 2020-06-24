import { push } from 'connected-react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import {
  getUIPage,
  getUISection,
  getUISortBy,
  getUIOnlyOnSale,
  getUIWearableRarities,
  getUIWearableGenders,
  getUISearch,
  getUIContracts
} from '../../modules/ui/selectors'
import {
  SearchOptions,
  getSearchParams,
  getSearchCategory
} from '../routing/search'
import { getFingerprint } from './estate/utils'
import { NFT, NFTCategory } from './types'

export const useFingerprint = (nft: NFT | null) => {
  const [fingerprint, setFingerprint] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (nft) {
      switch (nft.category) {
        case NFTCategory.ESTATE: {
          setIsLoading(true)
          getFingerprint(nft.tokenId)
            .then(result => setFingerprint(result))
            .catch(error =>
              console.error(
                `Error getting fingerprint for nft ${nft.tokenId}`,
                error
              )
            )
            .then(() => setIsLoading(false))
          break
        }
        default:
          break
      }
    }
  }, [nft, setFingerprint, setIsLoading])

  return [fingerprint, isLoading] as const
}

export const useNavigate = () => {
  const dispatch = useDispatch()

  const page = useSelector(getUIPage)
  const sortBy = useSelector(getUISortBy)
  const section = useSelector(getUISection)
  const wearableRarities = useSelector(getUIWearableRarities)
  const wearableGenders = useSelector(getUIWearableGenders)
  const contracts = useSelector(getUIContracts)
  const search = useSelector(getUISearch)
  const onlyOnSale = useSelector(getUIOnlyOnSale)

  const [isLoadMore, setIsLoadMore] = useState(false)

  const callback = useCallback(
    (options: SearchOptions) => {
      let newOptions: SearchOptions = {
        section,
        sortBy,
        onlyOnSale,
        page: 1,
        ...options
      }
      const prevCategory = section ? getSearchCategory(section) : null
      const nextCategory = newOptions.section
        ? getSearchCategory(newOptions.section)
        : null

      // Category specific logic to keep filters if the category doesn't change
      if (prevCategory && prevCategory === nextCategory) {
        switch (nextCategory) {
          case NFTCategory.WEARABLE: {
            newOptions = {
              wearableRarities,
              wearableGenders,
              search,
              contracts,
              ...newOptions
            }
          }
        }
      }

      const isLoadMore = page < newOptions.page!

      // Keep search if section is not changing
      if (isLoadMore) {
        newOptions.search = search
      }

      setIsLoadMore(isLoadMore)

      const searchParams = getSearchParams(newOptions)
      const { pathname } = window.location

      return dispatch(
        push(searchParams ? `${pathname}?${searchParams.toString()}` : pathname)
      )
    },
    [
      page,
      contracts,
      onlyOnSale,
      search,
      section,
      sortBy,
      wearableGenders,
      wearableRarities,
      dispatch,
      setIsLoadMore
    ]
  )

  return [callback, isLoadMore, setIsLoadMore] as const
}
