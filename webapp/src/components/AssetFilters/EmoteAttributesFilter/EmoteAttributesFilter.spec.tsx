import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../../utils/test'
import { EmoteAttributesFilter } from './EmoteAttributesFilter'
import { Props } from './EmoteAttributesFilter.types'

function renderEmoteAttributesFilter(props: Partial<Props> = {}) {
  return renderWithProviders(
    <EmoteAttributesFilter
      onChange={jest.fn()}
      emoteHasGeometry={false}
      emoteHasSound={false}
      emotePlayMode={[]}
      {...props}
    />
  )
}

describe('when rendering the emote attributes filter', () => {
  it('should render sound filter', () => {
    const screen = renderEmoteAttributesFilter()
    expect(
      screen.getByText(t('nft_filters.emote_attributes.with_sound'))
    ).toBeInTheDocument()
  })

  it("shouldn't render geometry filter", () => {
    const screen = renderEmoteAttributesFilter()
    expect(
      screen.getByText(t('nft_filters.emote_attributes.with_props'))
    ).toBeInTheDocument()
  })

  describe('when sound filter is clicked', () => {
    it('should call onChange with emoteHasSound true', () => {
      const onChange = jest.fn()
      const screen = renderEmoteAttributesFilter({
        onChange
      })
      screen.getByText(t('nft_filters.emote_attributes.with_sound')).click()
      expect(onChange).toHaveBeenCalledWith({
        emoteHasSound: true,
        emoteHasGeometry: undefined,
        emotePlayMode: []
      })
    })
  })

  describe('when prop filter is clicked', () => {
    it('should call onChange with emoteHasGeometry true', () => {
      const onChange = jest.fn()
      const screen = renderEmoteAttributesFilter({
        onChange
      })
      screen.getByText(t('nft_filters.emote_attributes.with_props')).click()
      expect(onChange).toHaveBeenCalledWith({
        emoteHasGeometry: true,
        emoteHasSound: undefined,
        emotePlayMode: []
      })
    })
  })
})
