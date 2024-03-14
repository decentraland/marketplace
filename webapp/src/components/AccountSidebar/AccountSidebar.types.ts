import { Dispatch } from 'redux'
import { browse, BrowseAction } from '../../modules/routing/actions'
import { Section } from '../../modules/vendor/decentraland'

export type Props = {
  section: Section
  address: string
  isCurrentAccount?: boolean
  onBrowse: typeof browse
}

export type MapStateProps = Pick<Props, 'section'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
