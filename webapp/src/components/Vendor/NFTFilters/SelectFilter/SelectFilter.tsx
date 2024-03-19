import { useEffect, useRef, useState } from 'react'
import { Header, Dropdown, Icon } from 'decentraland-ui'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './SelectFilter.types'
import './SelectFilter.css'

const SelectFilter = (props: Props) => {
  const { name, options, fetchOptions, fetchOptionFromValue, value, clearable, onChange, disabled = false, placeholder, className } = props

  const [providedOptions, setProvidedOptions] = useState(options)
  const [search, setSearch] = useState('')
  const searchTimeout = useRef<NodeJS.Timeout>()
  const previousSearch = useRef(search)
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // In the case that the value does not match to one of the options,
  // the component will try to fetch the option from the backend and add it.
  // If the option is not found, the value will be changed to the first option.
  useEffect(() => {
    async function tryFetchOptionFromValue() {
      if (!value || !fetchOptionFromValue || providedOptions.some(option => option.value === value)) {
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

    void tryFetchOptionFromValue()
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
      setIsTyping(false)

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
  }, [search, fetchOptions, options, isTyping])

  return (
    <div className={classNames('SelectFilter Filter', className)}>
      {name ? (
        <Header sub className="name">
          {name}
        </Header>
      ) : null}
      <Dropdown
        value={value}
        options={providedOptions}
        clearable={clearable}
        selection
        search
        selectOnNavigation={false}
        fluid
        selectOnBlur={false}
        noResultsMessage={
          search.length > 0 && !isTyping && !isLoading && providedOptions.length === 0
            ? t('filters.no_results')
            : t('filters.type_to_search')
        }
        loading={isLoading}
        placeholder={placeholder}
        icon={fetchOptions ? <Icon name="search" className={classNames(isLoading && 'search-loading')} /> : <Icon name="dropdown" />}
        onChange={(_event, data) => {
          onChange(data.value as string)

          // Settings the search back to empty to be able to
          // search for the same value again as it would match with
          // the previous search.
          if (!data.value) {
            setSearch('')
          }
        }}
        disabled={disabled}
        onSearchChange={(_event, data) => {
          setIsTyping(true)
          setSearch(data.searchQuery)
        }}
      />
    </div>
  )
}

export default SelectFilter
