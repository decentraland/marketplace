import { useEffect, useRef, useState } from 'react'
import { Header, Dropdown } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './SelectFilter.types'
import './SelectFilter.css'

const SelectFilter = (props: Props) => {
  const {
    name,
    options,
    fetchOptions,
    fetchOptionFromValue,
    value,
    clearable,
    onChange,
    disabled = false
  } = props

  const [providedOptions, setProvidedOptions] = useState(options)
  const [search, setSearch] = useState('')
  const searchTimeout = useRef<NodeJS.Timeout>()
  const previousSearch = useRef(search)
  const [isLoading, setIsLoading] = useState(false)

  // In the case that the value does not match to one of the options,
  // the component will try to fetch the option from the backend and add it.
  // If the option is not found, the value will be changed to the first option.
  useEffect(() => {
    async function tryFetchOptionFromValue() {
      if (
        !fetchOptionFromValue ||
        providedOptions.some(option => option.value === value)
      ) {
        return
      }

      setIsLoading(true)

      const result = await fetchOptionFromValue(value)

      setIsLoading(false)

      if (!result) {
        onChange(providedOptions[0].value)
      } else {
        setProvidedOptions([...providedOptions, result])
      }
    }

    tryFetchOptionFromValue()
  }, [fetchOptionFromValue, providedOptions, value, onChange])

  // The component will fetch the options from the backend depending on the search input.
  // The search will be triggered after some time of inactivity to prevent too many requests.
  useEffect(() => {
    if (!fetchOptions) {
      return
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    searchTimeout.current = setTimeout(async () => {
      if (previousSearch.current === search) {
        return
      }

      previousSearch.current = search

      if (!search) {
        setProvidedOptions(options)
        return
      }

      setIsLoading(true)

      const result = await fetchOptions(search)

      setIsLoading(false)

      setProvidedOptions([...options, ...result])
    }, 500)

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [search, fetchOptions, options])

  return (
    <div className="SelectFilter Filter">
      <Header sub className="name">
        {name}
      </Header>
      <Dropdown
        value={value}
        options={providedOptions}
        clearable={clearable}
        selection
        search
        selectOnNavigation={false}
        fluid
        noResultsMessage={t('filters.no_results')}
        loading={isLoading}
        onChange={(_event, data) => {
          onChange(data.value as string)

          if (!data.value) {
            setSearch('')
          }
        }}
        disabled={disabled}
        onSearchChange={(_event, data) => {
          setSearch(data.searchQuery)
        }}
      />
    </div>
  )
}

export default SelectFilter
