// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import path from 'path'
import { TextEncoder, TextDecoder } from 'util'
import { config } from 'dotenv'
import flatten from 'flat'
// eslint-disable-next-line import/order
import fetch, { Request, Response } from 'node-fetch'
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires */
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}))

jest.mock('libsodium-wrappers-sumo', () => ({
  ready: Promise.resolve(),
  crypto_sign_keypair: jest.fn(),
  crypto_sign_detached: jest.fn(),
  crypto_sign_verify_detached: jest.fn(),
  to_hex: jest.fn(),
  from_hex: jest.fn()
}))

jest.mock('decentraland-dapps/dist/modules/translation/utils', () => {
  const module = jest.requireActual('decentraland-dapps/dist/modules/translation/utils')
  return {
    ...module,
    T: ({ id, values }: { id: string; values?: any }) => module.t(id, values)
  }
})

jest.mock('decentraland-dapps/dist/containers/Navbar', () => {
  const React = require('react')
  const Navbar2Component = () => React.createElement('div', { 'data-testid': 'navbar2-mock' })
  return {
    Navbar2: Navbar2Component
  }
})

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
    WearablePreview: MockComponent,
    ZoomControls: MockComponent,
    ButtonGroup: MockComponent,
    Button: MockComponent,
    Menu: MockComponent,
    MenuItem: MockComponent,
    CreditsToggle: MockComponent,
    JumpIn: MockComponent,
    styled: styledMock
  }
})

jest.mock('decentraland-dapps/dist/modules/campaign/ContentfulClient', () => {
  return {
    ContentfulClient: jest.fn().mockImplementation(() => ({
      fetch: jest.fn().mockResolvedValue({}),
      getEntry: jest.fn().mockResolvedValue(null),
      getEntries: jest.fn().mockResolvedValue({ items: [] })
    }))
  }
})

jest.mock('decentraland-dapps/dist/modules/campaign/sagas', () => {
  return {
    campaignSagas: jest.fn().mockImplementation(
      () =>
        function* () {
          yield
        }
    )
  }
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined, // Deprecated
    removeListener: () => undefined, // Deprecated
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => undefined
  })
})

config({ path: path.resolve(process.cwd(), '.env.example') })
global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any
if (!globalThis.fetch) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.fetch = fetch as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.Request = Request as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.Response = Response as any
}

global.FontFace = function () {
  return {
    load: () => Promise.resolve()
  }
} as any
;(document as { fonts: typeof document.fonts }).fonts = {
  ...document.fonts,
  add: () => Promise.resolve()
} as any

const { en: dappsEn } = require('decentraland-dapps/dist/modules/translation/defaults')
const translationUtils = require('decentraland-dapps/dist/modules/translation/utils')
const locales = require('../modules/translation/locales')

translationUtils.setCurrentLocale('en', translationUtils.mergeTranslations(flatten(dappsEn), flatten(locales.en)))
/* eslint-enable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires */
