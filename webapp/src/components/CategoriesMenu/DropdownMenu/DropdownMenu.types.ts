import { Section, SearchOptions } from '../../../modules/routing/search'

export type Props = {
  sections: Section[]
  currentSection: Section
  onNavigate: (options?: SearchOptions) => void
}
