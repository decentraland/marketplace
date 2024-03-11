import React, { useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Dropdown, DropdownProps, EmoteIcon, Mobile, NotMobile, Tabs, WearableIcon } from 'decentraland-ui'
import { HomepageView } from '../../../modules/ui/asset/homepage/types'
import { Section } from '../../../modules/vendor/decentraland/routing/types'

const ItemsSection = (props: {
  view: HomepageView
  viewAllButton: React.ReactNode
  onChangeItemSection: (view: HomepageView, section: Section) => void
}) => {
  const { view, viewAllButton, onChangeItemSection } = props
  const [currentItemSection, setCurrentItemSection] = useState<Section>(Section.WEARABLES)

  const handleOnChangeItemSection = (view: HomepageView, section: Section) => {
    setCurrentItemSection(section)
    onChangeItemSection(view, section)
  }

  const renderTabs = () => (
    <Tabs>
      <Tabs.Tab active={currentItemSection === Section.WEARABLES} onClick={() => handleOnChangeItemSection(view, Section.WEARABLES)}>
        <div id={Section.WEARABLES}>
          <WearableIcon />
          {t(`menu.${Section.WEARABLES}`)}
        </div>
      </Tabs.Tab>
      <Tabs.Tab active={currentItemSection === Section.EMOTES} onClick={() => handleOnChangeItemSection(view, Section.EMOTES)}>
        <div id={Section.EMOTES}>
          <EmoteIcon />
          {t(`menu.${Section.EMOTES}`)}
        </div>
      </Tabs.Tab>
      <div className="view-all-button">
        <Tabs.Tab>{viewAllButton}</Tabs.Tab>
      </div>
    </Tabs>
  )

  const renderDropdown = () => (
    <Dropdown
      defaultValue={currentItemSection}
      value={currentItemSection}
      direction="right"
      options={[Section.WEARABLES, Section.EMOTES].map(section => ({
        value: section,
        text: t(`menu.${section}`)
      }))}
      onChange={(_event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) =>
        handleOnChangeItemSection(view, value as Section)
      }
    />
  )

  return (
    <div className="ItemsSection">
      <NotMobile>{renderTabs()}</NotMobile>
      <Mobile>
        {renderDropdown()}
        {viewAllButton}
      </Mobile>
    </div>
  )
}

export default React.memo(ItemsSection)
