// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import path from 'path'
import { TextEncoder, TextDecoder } from 'util'
import { config } from 'dotenv'
import flatten from 'flat'
import fetch, { Request, Response } from 'node-fetch'
import { en as dappsEn } from 'decentraland-dapps/dist/modules/translation/defaults'
import * as translationUtils from 'decentraland-dapps/dist/modules/translation/utils'
import * as locales from '../modules/translation/locales'

jest.mock('decentraland-dapps/dist/modules/translation/utils', () => {
  const module = jest.requireActual<typeof translationUtils>('decentraland-dapps/dist/modules/translation/utils')
  return {
    ...module,
    T: ({ id, values }: { id: string; values?: any }) => module.t(id, values)
  }
})

config({ path: path.resolve(process.cwd(), '.env.example') })
global.TextEncoder = TextEncoder
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

translationUtils.setCurrentLocale('en', translationUtils.mergeTranslations(flatten(dappsEn), flatten(locales.en)))

const mockObservers: MockIntersectionObserver[] = []

class MockIntersectionObserver implements IntersectionObserver {
  root: Element | Document | null = null
  rootMargin: string = ''
  thresholds: ReadonlyArray<number> = []
  callback: IntersectionObserverCallback
  elements: Element[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    mockObservers.push(this)
  }

  observe(element: Element) {
    this.elements.push(element)
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter(el => el !== element)
  }

  disconnect() {
    this.elements = []
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  // Helper method to simulate intersection
  triggerIntersect(isIntersecting = true) {
    const entries = this.elements.map(element => ({
      isIntersecting,
      target: element,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      boundingClientRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0
    })) as IntersectionObserverEntry[]

    this.callback(entries, this)
  }
}

window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
