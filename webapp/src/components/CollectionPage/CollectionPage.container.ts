import { connect } from 'react-redux'
import CollectionPage from './CollectionPage'
import { Props } from './CollectionPage.types'

const mapState = () => ({})

const mapDispatch = () => ({})

const mergeProps = (): Props => ({
  onBack: () => {},
  collection: { name: 'Season 1' } as any,
  items: [],
  isLoading: true
})

export default connect(mapState, mapDispatch, mergeProps)(CollectionPage)
