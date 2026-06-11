/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-var-requires */
import { act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Network } from '@dcl/schemas'
import { renderWithProviders } from '../../utils/test'
import { EmotePreviewPlayerProvider, EmotePreviewSource, useEmotePreviewPlayer } from './EmotePreviewPlayer'

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
const DEFAULT_SOURCE: EmotePreviewSource = {
  contractAddress: '0xcontract',
  itemId: '1',
  network: Network.MATIC
}

const Probe = ({ source = DEFAULT_SOURCE }: { source?: EmotePreviewSource }) => {
  const player = useEmotePreviewPlayer()
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
      <button onClick={() => player?.hide()}>hide</button>
    </>
  )
}

const getOverlay = () => document.querySelector('.EmotePreviewPlayer')
const getSpinner = () => document.querySelector('.EmotePreviewPlayer__spinner')
const fireLoad = () =>
  act(() => {
    capturedOnLoad?.()
  })
const fireError = () =>
  act(() => {
    capturedOnError?.()
  })

describe('EmotePreviewPlayer', () => {
  beforeEach(() => {
    capturedOnLoad = undefined
    capturedOnError = undefined
    // The rect-tracking rAF loop is irrelevant to these lifecycle assertions;
    // stub it so it doesn't schedule state updates outside act().
    jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(0)
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
  })

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
        <EmotePreviewPlayerProvider enabled={false}>
          <Probe />
        </EmotePreviewPlayerProvider>
      )
      expect(getOverlay()).toBeNull()
    })
  })

  describe('when the provider is enabled', () => {
    it('should render the overlay in the warming (hidden) state', () => {
      renderWithProviders(
        <EmotePreviewPlayerProvider enabled>
          <Probe />
        </EmotePreviewPlayerProvider>
      )
      expect(getOverlay()).toHaveClass('is-warming')
      expect(getSpinner()).toBeNull()
    })

    describe('and show is called', () => {
      it('should make the overlay visible and display the spinner', async () => {
        const { getByText } = renderWithProviders(
          <EmotePreviewPlayerProvider enabled>
            <Probe />
          </EmotePreviewPlayerProvider>
        )
        await userEvent.click(getByText('show'))
        expect(getOverlay()).toHaveClass('is-visible')
        expect(getSpinner()).not.toBeNull()
      })
    })

    describe('and hide is called after show', () => {
      it('should hide the overlay and remove the spinner', async () => {
        const { getByText } = renderWithProviders(
          <EmotePreviewPlayerProvider enabled>
            <Probe />
          </EmotePreviewPlayerProvider>
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
          <EmotePreviewPlayerProvider enabled>
            <Probe />
          </EmotePreviewPlayerProvider>
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
          <EmotePreviewPlayerProvider enabled>
            <Probe />
          </EmotePreviewPlayerProvider>
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
          <EmotePreviewPlayerProvider enabled>
            <Probe />
          </EmotePreviewPlayerProvider>
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
          <EmotePreviewPlayerProvider enabled>
            <Probe />
          </EmotePreviewPlayerProvider>
        )
        fireLoad() // boot of the first iframe → controllable

        rerender(
          <EmotePreviewPlayerProvider enabled={false}>
            <Probe />
          </EmotePreviewPlayerProvider>
        )
        rerender(
          <EmotePreviewPlayerProvider enabled>
            <Probe />
          </EmotePreviewPlayerProvider>
        )

        await userEvent.click(getByText('show'))
        // After the reset, the first LOAD of the fresh iframe is treated as a
        // boot (not an emote render), so it must NOT clear the spinner.
        fireLoad()
        expect(getSpinner()).not.toBeNull()
      })
    })
  })
})
