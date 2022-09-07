import { Props as NFTSectionsProps } from '../NFTSections.types'

export type Props = NFTSectionsProps & {
  areEmoteCategoriesEnabled: boolean
}

export type MapStateProps = Pick<Props, 'areEmoteCategoriesEnabled'>
