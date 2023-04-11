import { forwardRef } from 'react'
import { Dropdown, Tabs } from 'decentraland-ui'
import { Props } from './TableContianer.types'
import './TableContainer.css'

const TableContainer = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    children,
    tabsList,
    activeTab,
    handleTabChange,
    sortbyList,
    handleSortByChange,
    sortBy
  } = props

  return (
    <div className={'tableContainer'} ref={ref}>
      <div className={'filtertabsContainer'}>
        <Tabs isFullscreen>
          {tabsList.map(tab => (
            <Tabs.Tab
              active={activeTab === tab}
              onClick={() => {
                handleTabChange && handleTabChange(tab)
              }}
            >
              <div className={'tabStyle'}>{tab}</div>
            </Tabs.Tab>
          ))}
        </Tabs>
        {sortbyList && (
          <Dropdown
            direction="left"
            className={'sortByDropdown'}
            value={sortBy}
            onChange={(_event, data) => {
              const value = data.value as string
              handleSortByChange && handleSortByChange(value)
            }}
            options={sortbyList}
          />
        )}
      </div>
      {children}
    </div>
  )
})

export default TableContainer
