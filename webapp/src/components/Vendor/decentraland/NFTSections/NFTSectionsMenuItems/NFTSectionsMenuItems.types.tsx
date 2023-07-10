import { Props as NFTSectionsProps } from '../NFTSections.types'

export type Props = NFTSectionsProps & {
  isHandsCategoryEnabled: boolean
}

export type MapStateProps = Pick<Props, 'isHandsCategoryEnabled'>
