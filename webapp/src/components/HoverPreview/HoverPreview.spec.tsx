/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-var-requires */
import { act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BodyShape, NFTCategory, Network, PreviewEmote, PreviewMessageType, PreviewOptions, PreviewType } from '@dcl/schemas'
import { RootState } from '../../modules/reducer'
import { renderWithProviders } from '../../utils/test'
import { HoverPreviewProvider, HoverPreviewSource, useHoverPreview } from './HoverPreview'

// Capture the latest onLoad/onError handed to the WearablePreview iframe so
// tests can drive the LOAD lifecycle, and render a real iframe element
// carrying the id the provider looks up via document.getElementById.
let capturedOnLoad: (() => void) | undefined
let capturedOnError: (() => void) | undefined

// Mirror the global decentraland-ui2 mock (see beforeSetupTests.ts) so the
// store/saga import chain still resolves styled() at module-eval time, but
// override WearablePreview to capture onLoad and render an iframe with the id
// the provider drives via document.getElementById.
jest.mock('decentraland-ui2', () => {
  const React = require('react')
  const createStyledComponent = () => () => React.createElement('div')
  const styledMock: any = () => createStyledComponent()
  styledMock.div = () => createStyledComponent()
  styledMock.span = () => createStyledComponent()
  styledMock.button = () => createStyledComponent()
  styledMock.a = () => createStyledComponent()
  styledMock.nav = () => createStyledComponent()
  styledMock.section = () => createStyledComponent()
  styledMock.header = () => createStyledComponent()
  const MockComponent = () => React.createElement('div')
  return {
    darkTheme: {},
    lightTheme: {},
    DclThemeProvider: ({ children }: { children: React.ReactNode }) => children,
    Navbar2: MockComponent,
    DownloadButton: MockComponent,
    Switch: MockComponent,
    AnimationControls: MockComponent,
    EmoteControls: MockComponent,
    ZoomControls: MockComponent,
    ButtonGroup: MockComponent,
    Button: MockComponent,
    Menu: MockComponent,
    MenuItem: MockComponent,
    CreditsToggle: MockComponent,
    JumpIn: MockComponent,
    styled: styledMock,
    WearablePreview: (props: { id?: string; onLoad?: () => void; onError?: () => void }) => {
      capturedOnLoad = props.onLoad
      capturedOnError = props.onError
      return React.createElement('iframe', { id: props.id, title: 'wearable-preview' })
    }
  }
})

const TARGET_TEST_ID = 'preview-target'
const AVATAR_ADDRESS = '0xowner'
const DEFAULT_SOURCE: HoverPreviewSource = {
  category: NFTCategory.EMOTE,
  contractAddress: '0xcontract',
  itemId: '1',
  network: Network.MATIC
}
const FEMALE_WEARABLE_SOURCE: HoverPreviewSource = {
  category: NFTCategory.WEARABLE,
  contractAddress: '0xwearable',
  itemId: '2',
  network: Network.MATIC,
  bodyShapes: [BodyShape.FEMALE]
}

// A store where the connected wallet has a published avatar of the given body shape.
const withAvatar = (bodyShape: BodyShape) =>
  ({
    wallet: { data: { address: AVATAR_ADDRESS } },
    profile: { data: { [AVATAR_ADDRESS]: { avatars: [{ avatar: { bodyShape } }] } } }
  }) as unknown as Partial<RootState>

const Probe = ({ source = DEFAULT_SOURCE }: { source?: HoverPreviewSource }) => {
  const player = useHoverPreview()
  return (
    <>
      <div data-testid={TARGET_TEST_ID} />
      <span data-testid="has-player">{player ? 'yes' : 'no'}</span>
      <button
        onClick={() => {
          const target = document.querySelector(`[data-testid="${TARGET_TEST_ID}"]`)
          if (target) {
            player?.show(target as HTMLElement, source)
          }
        }}
      >
        show
      </button>
      <button
        onClick={() => {
          const target = document.querySelector(`[data-testid="${TARGET_TEST_ID}"]`)
          if (target) {
            player?.hide(target as HTMLElement)
          }
        }}
      >
        hide
      </button>
    </>
  )
}

const getOverlay = () => document.querySelector('.HoverPreview')
const getSpinner = () => document.querySelector('.HoverPreview__spinner')

// The provider drives the iframe by postMessage, so the options it sends are the only observable
// contract between a hovered card and what the preview app renders.
const spyOnPreviewMessages = () => {
  const iframe = document.querySelector('.HoverPreview iframe') as HTMLIFrameElement
  return jest.spyOn(iframe.contentWindow as Window, 'postMessage')
}
const getLastSentOptions = (postMessage: jest.SpyInstance): PreviewOptions => {
  const calls = postMessage.mock.calls
  const [message] = calls[calls.length - 1] as [{ type: PreviewMessageType; payload: { options: PreviewOptions } }]
  expect(message.type).toBe(PreviewMessageType.UPDATE)
  return message.payload.options
}
const fireLoad = () =>
  act(() => {
    capturedOnLoad?.()
  })
const fireError = () =>
  act(() => {
    capturedOnError?.()
  })

describe('HoverPreview', () => {
  beforeEach(() => {
    capturedOnLoad = undefined
    capturedOnError = undefined
    // The rect-tracking rAF loop is irrelevant to these lifecycle assertions;
    // stub it so it doesn't schedule state updates outside act().
    jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(0)
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
    // jsdom implements neither idle callback. Boot the overlay immediately so these assertions
    // exercise the iframe lifecycle rather than the idle wait, which has its own test below.
    window.requestIdleCallback = ((callback: IdleRequestCallback) => {
      callback({ didTimeout: false, timeRemaining: () => 0 })
      return 1
    }) as typeof window.requestIdleCallback
    window.cancelIdleCallback = (() => undefined) as typeof window.cancelIdleCallback
  })

  // The idle-callback stubs are deliberately NOT restored: React unmounts the provider during
  // testing-library's cleanup, which runs after this hook, and its effect teardown calls
  // cancelIdleCallback. jsdom globals are per test file, so the stubs cannot leak elsewhere.
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when used outside of a provider', () => {
    it('should expose a null controller', () => {
      const { getByTestId } = renderWithProviders(<Probe />)
      expect(getByTestId('has-player')).toHaveTextContent('no')
    })
  })

  describe('when the provider is disabled', () => {
    it('should not render the preview overlay', () => {
      renderWithProviders(
        <HoverPreviewProvider enabled={false}>
          <Probe />
        </HoverPreviewProvider>
      )
      expect(getOverlay()).toBeNull()
    })
  })

  describe('when the iframe becomes controllable while cards are mounted', () => {
    it('should keep the same context identity so consumers are not torn down mid-hover', () => {
      const identities: unknown[] = []
      const IdentitySpy = () => {
        identities.push(useHoverPreview())
        return null
      }

      renderWithProviders(
        <HoverPreviewProvider enabled>
          <IdentitySpy />
        </HoverPreviewProvider>
      )
      fireLoad() // boot → controllable, which rebuilds `show`

      // Every card in the grid consumes this value. A new identity would re-render all of them and
      // fire their unmount cleanups, releasing a preview the pointer never left.
      expect(new Set(identities).size).toBe(1)
    })
  })

  describe('when the provider is enabled but the browser has not gone idle yet', () => {
    it('should not mount the preview iframe until it does', () => {
      let boot: (() => void) | undefined
      window.requestIdleCallback = ((callback: IdleRequestCallback) => {
        boot = () => callback({ didTimeout: false, timeRemaining: () => 0 })
        return 1
      }) as typeof window.requestIdleCallback

      renderWithProviders(
        <HoverPreviewProvider enabled>
          <Probe />
        </HoverPreviewProvider>
      )

      // Standing up the preview app and its WebGL context must not compete with the page's own
      // first paint — it is deferred until the browser has nothing better to do.
      expect(getOverlay()).toBeNull()
      act(() => boot?.())
      expect(getOverlay()).not.toBeNull()
    })
  })

  describe('when the provider is enabled', () => {
    it('should render the overlay in the warming (hidden) state', () => {
      renderWithProviders(
        <HoverPreviewProvider enabled>
          <Probe />
        </HoverPreviewProvider>
      )
      expect(getOverlay()).toHaveClass('is-warming')
      expect(getSpinner()).toBeNull()
    })

    describe('and show is called', () => {
      it('should make the overlay visible and display the spinner', async () => {
        const { getByText } = renderWithProviders(
          <HoverPreviewProvider enabled>
            <Probe />
          </HoverPreviewProvider>
        )
        await userEvent.click(getByText('show'))
        expect(getOverlay()).toHaveClass('is-visible')
        expect(getSpinner()).not.toBeNull()
      })
    })

    describe('and hide is called after show', () => {
      it('should hide the overlay and remove the spinner', async () => {
        const { getByText } = renderWithProviders(
          <HoverPreviewProvider enabled>
            <Probe />
          </HoverPreviewProvider>
        )
        await userEvent.click(getByText('show'))
        await userEvent.click(getByText('hide'))
        expect(getOverlay()).toHaveClass('is-warming')
        expect(getSpinner()).toBeNull()
      })
    })

    describe('and the emote finishes loading after the initial boot', () => {
      it('should clear the spinner', async () => {
        const { getByText } = renderWithProviders(
          <HoverPreviewProvider enabled>
            <Probe />
          </HoverPreviewProvider>
        )
        // First LOAD = iframe boot, marks it controllable.
        fireLoad()
        await userEvent.click(getByText('show'))
        expect(getSpinner()).not.toBeNull()
        // Second LOAD = the emote scene finished rendering.
        fireLoad()
        expect(getSpinner()).toBeNull()
      })
    })

    describe('and the same already-loaded emote is hovered again', () => {
      it('should not show the spinner since no reload will occur', async () => {
        const { getByText } = renderWithProviders(
          <HoverPreviewProvider enabled>
            <Probe />
          </HoverPreviewProvider>
        )
        fireLoad() // boot
        await userEvent.click(getByText('show')) // request emote
        fireLoad() // emote finished loading
        expect(getSpinner()).toBeNull()
        await userEvent.click(getByText('hide'))
        // Re-hovering the same emote sends an identical UPDATE that won't
        // rebuild the scene (no LOAD will follow), so the spinner must not
        // appear — otherwise it would stay stuck forever.
        await userEvent.click(getByText('show'))
        expect(getSpinner()).toBeNull()
      })
    })

    describe('and the emote fails to load', () => {
      it('should clear the spinner on error', async () => {
        const { getByText } = renderWithProviders(
          <HoverPreviewProvider enabled>
            <Probe />
          </HoverPreviewProvider>
        )
        fireLoad() // boot
        await userEvent.click(getByText('show'))
        expect(getSpinner()).not.toBeNull()
        fireError()
        expect(getSpinner()).toBeNull()
      })
    })

    describe('and the provider is re-enabled after being disabled', () => {
      it('should treat the next iframe boot LOAD as initialization again', async () => {
        const { getByText, rerender } = renderWithProviders(
          <HoverPreviewProvider enabled>
            <Probe />
          </HoverPreviewProvider>
        )
        fireLoad() // boot of the first iframe → controllable

        rerender(
          <HoverPreviewProvider enabled={false}>
            <Probe />
          </HoverPreviewProvider>
        )
        rerender(
          <HoverPreviewProvider enabled>
            <Probe />
          </HoverPreviewProvider>
        )

        await userEvent.click(getByText('show'))
        // After the reset, the first LOAD of the fresh iframe is treated as a
        // boot (not an asset render), so it must NOT clear the spinner.
        fireLoad()
        expect(getSpinner()).not.toBeNull()
      })
    })

    describe('and an emote is hovered', () => {
      it('should leave the preview type and animation for the preview app to resolve', async () => {
        const { getByText } = renderWithProviders(
          <HoverPreviewProvider enabled>
            <Probe />
          </HoverPreviewProvider>
        )
        fireLoad() // boot
        const postMessage = spyOnPreviewMessages()
        await userEvent.click(getByText('show'))
        const options = getLastSentOptions(postMessage)
        // An emote carries its own animation and plays on any body, so forcing either would
        // override what the preview app already knows how to do.
        expect(options.type).toBeUndefined()
        expect(options.emote).toBeUndefined()
        expect(options.profile).toBe('default')
      })
    })

    describe('and a wearable is hovered', () => {
      describe('and no avatar is connected', () => {
        it('should pose a default mannequin pinned to a body shape the item supports', async () => {
          const { getByText } = renderWithProviders(
            <HoverPreviewProvider enabled>
              <Probe source={FEMALE_WEARABLE_SOURCE} />
            </HoverPreviewProvider>
          )
          fireLoad() // boot
          const postMessage = spyOnPreviewMessages()
          await userEvent.click(getByText('show'))
          expect(getLastSentOptions(postMessage)).toEqual(
            expect.objectContaining({
              type: PreviewType.AVATAR,
              emote: PreviewEmote.FASHION,
              profile: 'default',
              bodyShape: BodyShape.FEMALE
            })
          )
        })
      })

      describe('and the connected avatar has no representation for the item', () => {
        it('should fall back to the mannequin so the wearable is not rendered invisible', async () => {
          const { getByText } = renderWithProviders(
            <HoverPreviewProvider enabled>
              <Probe source={FEMALE_WEARABLE_SOURCE} />
            </HoverPreviewProvider>,
            { preloadedState: withAvatar(BodyShape.MALE) }
          )
          fireLoad() // boot
          const postMessage = spyOnPreviewMessages()
          await userEvent.click(getByText('show'))
          expect(getLastSentOptions(postMessage)).toEqual(expect.objectContaining({ profile: 'default', bodyShape: BodyShape.FEMALE }))
        })
      })

      describe('and the connected avatar can wear the item', () => {
        it('should dress the connected avatar', async () => {
          const { getByText } = renderWithProviders(
            <HoverPreviewProvider enabled>
              <Probe source={FEMALE_WEARABLE_SOURCE} />
            </HoverPreviewProvider>,
            { preloadedState: withAvatar(BodyShape.FEMALE) }
          )
          fireLoad() // boot
          const postMessage = spyOnPreviewMessages()
          await userEvent.click(getByText('show'))
          expect(getLastSentOptions(postMessage)).toEqual(expect.objectContaining({ profile: AVATAR_ADDRESS, bodyShape: null }))
        })
      })
    })
  })
})
