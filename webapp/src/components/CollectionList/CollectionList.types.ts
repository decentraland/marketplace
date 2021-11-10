import { Collection } from '@dcl/schemas'

export type Props = { collections: Collection[]; isLoading: boolean }

export type MapStateProps = Pick<Props, 'collections' | 'isLoading'>
