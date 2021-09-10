import { Header, Dropdown } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { Props } from './SelectFilter.types'
import './SelectFilter.css'

const SelectFilter = (props: Props) => {
  const { name, options, value, clearable, onChange } = props
  return (
    <div className="SelectFilter Filter">
      <Header sub className="name">
        {name}
      </Header>
      <Dropdown
        value={value}
        options={options}
        clearable={clearable}
        selection
        search
        selectOnNavigation={false}
        fluid
        noResultsMessage={t('filters.no_results')}
        onChange={(_event, props) => onChange(props.value as string)}
      />
    </div>
  )
}

export default SelectFilter
