import { renderHook } from '@testing-library/react'
import { CampaignTheme } from '../../modules/features/campaignTheme'
import { useCampaignThemeAttribute } from './hooks'

const root = () => document.documentElement
const isDressed = () => root().hasAttribute('data-campaign-theme')

afterEach(() => {
  delete root().dataset.campaignTheme
})

describe('when a season is running', () => {
  it('should publish it on the document root', () => {
    renderHook(() => useCampaignThemeAttribute('halloween'))

    expect(root().dataset.campaignTheme).toBe('halloween')
  })
})

describe('when no season is running', () => {
  it('should leave the root with no attribute at all, rather than an empty one', () => {
    renderHook(() => useCampaignThemeAttribute(null))

    expect(isDressed()).toBe(false)
  })
})

describe('when the season is taken down while the page is open', () => {
  it('should take the skin off without waiting for a reload', () => {
    // The kill switch, end to end: the flag flips, the selector answers null, and the page has to undress
    // under a reader who never navigated.
    const { rerender } = renderHook(({ theme }) => useCampaignThemeAttribute(theme), {
      initialProps: { theme: 'halloween' as CampaignTheme | null }
    })
    expect(root().dataset.campaignTheme).toBe('halloween')

    rerender({ theme: null })

    expect(isDressed()).toBe(false)
  })
})

describe('when the season comes back', () => {
  it('should dress the root again, leaving no stale value in between', () => {
    const { rerender } = renderHook(({ theme }) => useCampaignThemeAttribute(theme), {
      initialProps: { theme: null as CampaignTheme | null }
    })

    rerender({ theme: 'halloween' })

    expect(root().dataset.campaignTheme).toBe('halloween')
  })
})

describe('when the page unmounts', () => {
  it('should take the skin off', () => {
    const { unmount } = renderHook(() => useCampaignThemeAttribute('halloween'))

    unmount()

    expect(isDressed()).toBe(false)
  })
})
