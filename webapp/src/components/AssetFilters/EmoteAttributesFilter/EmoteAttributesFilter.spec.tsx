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
      isEmotesV2Enabled={false}
      {...props}
    />
  )
}

describe('when isEmotesV2Enabled is false', () => {
  it("shouldn't render sound filter", () => {
    const screen = renderEmoteAttributesFilter({ isEmotesV2Enabled: false })
    expect(
      screen.queryByText(t('nft_filters.emote_attributes.with_sound'))
    ).not.toBeInTheDocument()
  })

  it("shouldn't render geometry filter", () => {
    const screen = renderEmoteAttributesFilter({ isEmotesV2Enabled: false })
    expect(
      screen.queryByText(t('nft_filters.emote_attributes.with_props'))
    ).not.toBeInTheDocument()
  })
})

describe('when isEmotesV2Enabled is true', () => {
  it('should render sound filter', () => {
    const screen = renderEmoteAttributesFilter({ isEmotesV2Enabled: true })
    expect(
      screen.getByText(t('nft_filters.emote_attributes.with_sound'))
    ).toBeInTheDocument()
  })

  it("shouldn't render geometry filter", () => {
    const screen = renderEmoteAttributesFilter({ isEmotesV2Enabled: true })
    expect(
      screen.getByText(t('nft_filters.emote_attributes.with_props'))
    ).toBeInTheDocument()
  })

  describe('when sound filter is clicked', () => {
    it('should call onChange with emoteHasSound true', () => {
      const onChange = jest.fn()
      const screen = renderEmoteAttributesFilter({
        isEmotesV2Enabled: true,
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
        isEmotesV2Enabled: true,
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
