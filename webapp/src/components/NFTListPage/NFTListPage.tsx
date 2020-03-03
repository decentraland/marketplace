import React, { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Page,
  Grid,
  Card,
  Radio,
  CheckboxProps,
  Button,
  Loader,
  HeaderMenu,
  Header,
  Dropdown,
  DropdownProps,
  Responsive,
  Modal,
  Close
} from 'decentraland-ui'

import {
  SearchOptions,
  Section,
  SortBy,
  getSearchCategory,
  getSearchWearableCategory
} from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { NFTCategory } from '../../modules/nft/types'
import { getSortOrder } from '../../modules/nft/utils'
import { MAX_QUERY_SIZE, PAGE_SIZE } from '../../lib/api/client'
import { NFTCard } from '../NFTCard'
import { CategoriesMenu } from '../CategoriesMenu'
import { Props } from './NFTListPage.types'
import './NFTListPage.css'
import { ArrayFilter } from './ArrayFilter'
import {
  WearableRarity,
  WearableGender
} from '../../modules/nft/wearable/types'
import { ClearFilter } from './ClearFilter'

const MAX_RESULTS = 1000
const RARITY_FILTER_OPTIONS = Object.values(WearableRarity)
  .filter(x => x !== WearableRarity.COMMON && x !== WearableRarity.UNIQUE)
  .reverse()
const GENDER_FILTER_OPTIONS = Object.values(WearableGender)

const NFTListPage = (props: Props) => {
  const {
    address,
    defaultOnlyOnSale,
    page,
    section,
    nfts,
    view,
    count,
    wearableRarities,
    wearableGenders,
    isLoading,
    onFetchNFTs,
    onNavigate
  } = props

  // "Instance" variables
  const category = section ? getSearchCategory(section) : null

  const hasFilters = category === NFTCategory.WEARABLE

  const onlyOnSale =
    props.onlyOnSale === null ? defaultOnlyOnSale : props.onlyOnSale

  const dropdownOptions = [
    { value: SortBy.NEWEST, text: t('filters.newest') },
    { value: SortBy.NAME, text: t('filters.name') }
  ]

  if (onlyOnSale) {
    dropdownOptions.unshift({
      value: SortBy.RECENTLY_LISTED,
      text: t('filters.recently_listed')
    })
    dropdownOptions.unshift({
      value: SortBy.CHEAPEST,
      text: t('filters.cheapest')
    })
  }

  const sortBy = dropdownOptions.find(option => option.value === props.sortBy)
    ? props.sortBy
    : dropdownOptions[0].value

  // State variables
  const [offset, setOffset] = useState(0)
  const [lastNFTLength, setLastNFTLength] = useState(0)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showFiltersMenu, setShowFiltersMenu] = useState(false)

  const fillVariables = useCallback(
    (options: SearchOptions) => {
      let newOptions: SearchOptions = {
        page,
        section,
        sortBy,
        onlyOnSale,
        ...options
      }
      const prevCategory = section ? getSearchCategory(section) : null
      const nextCategory = newOptions.section
        ? getSearchCategory(newOptions.section)
        : null
      if (prevCategory && prevCategory === nextCategory) {
        switch (nextCategory) {
          case NFTCategory.WEARABLE: {
            newOptions = {
              wearableRarities,
              wearableGenders,
              ...newOptions
            }
          }
        }
      }

      return newOptions
    },
    [wearableRarities, wearableGenders, page, section, sortBy, onlyOnSale]
  )

  // Handlers
  const handleOnNavigate = useCallback(
    (options?: SearchOptions) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          ...options,
          onlyOnSale,
          sortBy
        })
      )
    },
    [onlyOnSale, sortBy, onNavigate, fillVariables]
  )

  const handleOnlyOnSaleChange = useCallback(
    (_: React.SyntheticEvent, props: CheckboxProps) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          page: 1,
          onlyOnSale: !!props.checked
        })
      )
    },
    [onNavigate, fillVariables]
  )

  const handleDropdownChange = useCallback(
    (_: React.SyntheticEvent, props: DropdownProps) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          page: 1,
          sortBy: props.value as SortBy
        })
      )
    },
    [onNavigate, fillVariables]
  )

  const handleLoadMore = useCallback(() => {
    setOffset(page)
    setLastNFTLength(nfts.length)
    onNavigate(
      fillVariables({
        page: page + 1
      })
    )
  }, [page, nfts, onNavigate, setOffset, fillVariables])

  const handleRaritiesChange = useCallback(
    (options: string[]) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          page: 1,
          wearableRarities: options as WearableRarity[]
        })
      )
    },
    [setOffset, setLastNFTLength, onNavigate, fillVariables]
  )

  const handleGendersChange = useCallback(
    (options: string[]) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          page: 1,
          wearableGenders: options as WearableGender[]
        })
      )
    },
    [setOffset, setLastNFTLength, onNavigate, fillVariables]
  )

  const handleToggleFilterMenu = useCallback(
    () => setShowFiltersMenu(!showFiltersMenu),
    [showFiltersMenu, setShowFiltersMenu]
  )

  // Kick things off
  useEffect(() => {
    const skip = offset * PAGE_SIZE
    const first = Math.min(page * PAGE_SIZE - skip, MAX_QUERY_SIZE)

    const category = getSearchCategory(section)
    const [orderBy, orderDirection] = getSortOrder(sortBy)

    const isLand = section === Section.LAND
    const isWearableHead = section === Section.WEARABLES_HEAD
    const isWearableAccessory = section === Section.WEARABLES_ACCESORIES

    const wearableCategory =
      !isWearableAccessory && category === NFTCategory.WEARABLE
        ? getSearchWearableCategory(section)
        : undefined

    onFetchNFTs({
      variables: {
        first,
        skip,
        orderBy,
        orderDirection,
        onlyOnSale,
        address,
        isLand,
        isWearableHead,
        isWearableAccessory,
        category,
        wearableRarities,
        wearableGenders,
        wearableCategory
      },
      view: skip === 0 ? view : View.LOAD_MORE
    })
  }, [
    address,
    onlyOnSale,
    view,
    offset,
    page,
    section,
    sortBy,
    wearableRarities,
    wearableGenders,
    onFetchNFTs
  ])

  // close the menu when the category changes
  useEffect(() => setShowFiltersMenu(false), [category, setShowFiltersMenu])

  return (
    <Page className="NFTListPage">
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Grid.Column className="left-column">
          <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
        </Grid.Column>
      </Responsive>
      <Grid.Column className="right-column">
        <HeaderMenu>
          <HeaderMenu.Left>
            {wearableRarities.length > 0 ? (
              <Responsive
                minWidth={Responsive.onlyComputer.minWidth}
                as={ClearFilter}
                name={t('global.rarity')}
                onClear={() => handleRaritiesChange([])}
              />
            ) : null}
            {wearableGenders.length > 0 ? (
              <Responsive
                minWidth={Responsive.onlyComputer.minWidth}
                as={ClearFilter}
                name={t('global.gender')}
                onClear={() => handleGendersChange([])}
              />
            ) : null}
            <Header sub className="results">
              {count == null
                ? t('global.loading') + '...'
                : count < MAX_RESULTS
                ? t('nft_list_page.results', { count: count.toLocaleString() })
                : t('nft_list_page.more_than_results', {
                    count: count.toLocaleString()
                  })}
            </Header>
          </HeaderMenu.Left>
          <HeaderMenu.Right>
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
              <Radio
                toggle
                checked={onlyOnSale}
                onChange={handleOnlyOnSaleChange}
                label={t('nft_list_page.on_sale')}
              />
              <Dropdown
                direction="left"
                value={sortBy}
                options={dropdownOptions}
                onChange={handleDropdownChange}
              />
              {hasFilters ? (
                <div
                  className="open-filters-wrapper"
                  onClick={handleToggleFilterMenu}
                >
                  <div className="label">{t('nft_list_page.filter')}</div>
                  <div
                    className={`open-filters ${
                      showFiltersMenu ||
                      wearableRarities.length > 0 ||
                      wearableGenders.length > 0
                        ? 'active'
                        : ''
                    }`}
                  />
                </div>
              ) : null}
            </Responsive>
            <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
              <div
                className="open-filters-wrapper"
                onClick={() => setShowFiltersModal(!showFiltersModal)}
              >
                <div className="label">{t('nft_list_page.filter')}</div>
                <div className="open-filters" />
              </div>
            </Responsive>
          </HeaderMenu.Right>
        </HeaderMenu>

        {showFiltersMenu ? (
          <Responsive
            minWidth={Responsive.onlyTablet.minWidth}
            className="filters"
          >
            <ArrayFilter
              name={t('global.rarity')}
              values={wearableRarities}
              options={RARITY_FILTER_OPTIONS.map(rarity => ({
                value: rarity,
                label: t(`wearable.rarity.${rarity}`)
              }))}
              onChange={handleRaritiesChange}
            />
            <ArrayFilter
              name={t('global.gender')}
              values={wearableGenders}
              options={GENDER_FILTER_OPTIONS.map(gender => ({
                value: gender,
                label: t(`wearable.body_shape.${gender}`)
              }))}
              onChange={handleGendersChange}
            />
          </Responsive>
        ) : null}
        <Card.Group>
          {nfts.length > 0
            ? nfts.map(nft => <NFTCard key={nft.id} nft={nft} />)
            : null}
          {isLoading ? (
            <>
              <div className="overlay" />
              <Loader size="massive" active />
            </>
          ) : null}
        </Card.Group>

        {nfts.length === 0 && !isLoading ? (
          <div className="empty">{t('nft_list_page.empty')}</div>
        ) : null}

        {nfts.length >= PAGE_SIZE && nfts.length > lastNFTLength ? (
          <div className="load-more">
            <Button
              loading={isLoading}
              inverted
              primary
              onClick={handleLoadMore}
            >
              {t('global.load_more')}
            </Button>
          </div>
        ) : null}
      </Grid.Column>
      <Modal
        className="FiltersModal"
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        closeIcon={<Close onClick={() => setShowFiltersModal(false)} />}
      >
        <Modal.Header>Filter</Modal.Header>
        <Modal.Content>
          <div className="filter-row">
            <Header sub>{t('nft_list_page.on_sale')}</Header>
            <Radio
              toggle
              checked={onlyOnSale}
              onChange={handleOnlyOnSaleChange}
            />
          </div>
          <div className="filter-row">
            <Header sub>{t('nft_list_page.order_by')}</Header>
            <Dropdown
              direction="left"
              value={sortBy}
              options={dropdownOptions}
              onChange={handleDropdownChange}
            />
          </div>
          {hasFilters ? (
            <>
              <ArrayFilter
                name={t('global.rarity')}
                values={wearableRarities}
                options={RARITY_FILTER_OPTIONS.map(rarity => ({
                  value: rarity,
                  label: t(`wearable.rarity.${rarity}`)
                }))}
                onChange={handleRaritiesChange}
              />
              <ArrayFilter
                name={t('global.gender')}
                values={wearableGenders}
                options={GENDER_FILTER_OPTIONS.map(gender => ({
                  value: gender,
                  label: t(`wearable.body_shape.${gender}`)
                }))}
                onChange={handleGendersChange}
              />
            </>
          ) : null}
          <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
        </Modal.Content>
      </Modal>
    </Page>
  )
}

export default React.memo(NFTListPage)
