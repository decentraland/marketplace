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
      {tabsList.length || sortbyList?.length ? (
        <div className={'filtertabsContainer'}>
          {tabsList.length > 0 ? (
            <Tabs isFullscreen>
              {tabsList.map(tab => (
                <Tabs.Tab
                  key={tab.value}
                  active={activeTab === tab.value}
                  onClick={() => {
                    handleTabChange && handleTabChange(tab.value)
                  }}
                >
                  <div className={'tabStyle'}>{tab.displayValue}</div>
                </Tabs.Tab>
              ))}
            </Tabs>
          ) : null}
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
      ) : null}
      {children}
    </div>
  )
})

export default TableContainer
