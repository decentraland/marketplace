import { View } from '../../../modules/ui/types'

export type Props = {
  view?: View
}

export type MapStateProps = Pick<Props, 'view'>
