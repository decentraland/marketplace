import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { Section } from '../../../modules/vendor/decentraland/routing/types'
import { FilterPopover } from '../FilterPopover/FilterPopover'
import './SectionDropdown.css'

export type SectionLeaf = { type: 'leaf'; section: Section }
export type SectionGroup = { type: 'group'; section: Section; children: Section[] }
export type SectionItem = SectionLeaf | SectionGroup

export type SectionDropdownExtraItem = {
  key: string
  label: string
  active?: boolean
  onClick: () => void
}

export type SectionDropdownProps = {
  /** Base trigger label, e.g. "Wearables". */
  label: string
  /** Top-level section selecting the whole category (e.g. Section.WEARABLES). */
  rootSection: Section
  /** Items shown in the main list (leaves browse directly; groups open a flyout). */
  items: SectionItem[]
  /** Currently selected section. */
  section?: Section
  onSelect: (section: Section) => void
  /** Extra clickable rows shown above the items (e.g. "Smart Wearables"). */
  extraItems?: SectionDropdownExtraItem[]
}

export const SectionDropdown = ({ label, rootSection, items, section, onSelect, extraItems = [] }: SectionDropdownProps) => {
  const [openGroup, setOpenGroup] = useState<Section | null>(null)

  // Every section reachable from this dropdown — used to highlight the trigger.
  const allSections = useMemo(() => {
    const set = new Set<Section>([rootSection])
    items.forEach(item => {
      if (item.type === 'leaf') set.add(item.section)
      else {
        set.add(item.section)
        item.children.forEach(child => set.add(child))
      }
    })
    return set
  }, [items, rootSection])

  const belongsToGroup = !!section && allSections.has(section)
  const hasActiveExtra = extraItems.some(item => item.active)
  const triggerLabel = belongsToGroup && section && section !== rootSection ? t(`menu.${section}`) : label

  return (
    <FilterPopover label={triggerLabel} active={belongsToGroup || hasActiveExtra} className="SectionDropdown__popover">
      {close => {
        const select = (next: Section) => {
          onSelect(next)
          close()
        }
        const activeGroup = items.find(item => item.type === 'group' && item.section === openGroup) as SectionGroup | undefined
        return (
          <div className="SectionDropdown" onMouseLeave={() => setOpenGroup(null)}>
            <ul className="SectionDropdown__main">
              <li>
                <button
                  type="button"
                  className={classNames('SectionDropdown__item', { 'is-current': section === rootSection })}
                  onMouseEnter={() => setOpenGroup(null)}
                  onClick={() => select(rootSection)}
                >
                  {t(`menu.${rootSection}`)}
                </button>
              </li>
              {extraItems.map(item => (
                <li key={item.key}>
                  <button
                    type="button"
                    className={classNames('SectionDropdown__item', 'SectionDropdown__extra', { 'is-current': item.active })}
                    onMouseEnter={() => setOpenGroup(null)}
                    onClick={() => {
                      item.onClick()
                      close()
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {(extraItems.length || items.length) && <li className="SectionDropdown__divider" aria-hidden />}
              {items.map(item =>
                item.type === 'leaf' ? (
                  <li key={item.section}>
                    <button
                      type="button"
                      className={classNames('SectionDropdown__item', { 'is-current': section === item.section })}
                      onMouseEnter={() => setOpenGroup(null)}
                      onClick={() => select(item.section)}
                    >
                      {t(`menu.${item.section}`)}
                    </button>
                  </li>
                ) : (
                  <li key={item.section}>
                    <button
                      type="button"
                      className={classNames('SectionDropdown__item', 'SectionDropdown__group', {
                        'is-open': openGroup === item.section,
                        'is-current': section === item.section || item.children.includes(section as Section)
                      })}
                      onMouseEnter={() => setOpenGroup(item.section)}
                      onClick={() => setOpenGroup(prev => (prev === item.section ? null : item.section))}
                    >
                      <span>{t(`menu.${item.section}`)}</span>
                      <Icon name="chevron right" className="SectionDropdown__caret" />
                    </button>
                  </li>
                )
              )}
            </ul>
            {activeGroup ? (
              <ul className="SectionDropdown__flyout">
                <li>
                  <button
                    type="button"
                    className={classNames('SectionDropdown__item', { 'is-current': section === activeGroup.section })}
                    onClick={() => select(activeGroup.section)}
                  >
                    {t(`menu.${activeGroup.section}`)}
                  </button>
                </li>
                {activeGroup.children.map(child => (
                  <li key={child}>
                    <button
                      type="button"
                      className={classNames('SectionDropdown__item', { 'is-current': section === child })}
                      onClick={() => select(child)}
                    >
                      {t(`menu.${child}`)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      }}
    </FilterPopover>
  )
}

export default SectionDropdown
