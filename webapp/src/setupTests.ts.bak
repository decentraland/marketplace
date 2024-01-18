// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import path from 'path'
import { config } from 'dotenv'
import flatten from 'flat'
import {
  mergeTranslations,
  setCurrentLocale
} from 'decentraland-dapps/dist/modules/translation/utils'
import { en as dappsEn } from 'decentraland-dapps/dist/modules/translation/defaults'
import * as locales from './modules/translation/locales'

jest.mock('decentraland-dapps/dist/modules/translation/utils', () => {
  const module = jest.requireActual(
    'decentraland-dapps/dist/modules/translation/utils'
  )
  return {
    ...module,
    T: ({ id, values }: typeof module['T']) => module.t(id, values)
  }
})

jest.mock('decentraland-dapps/dist/modules/translation/utils', () => {
  const module = jest.requireActual(
    'decentraland-dapps/dist/modules/translation/utils'
  )
  return {
    ...module,
    T: ({ id, values }: typeof module['T']) => module.t(id, values)
  }
})

config({ path: path.resolve(process.cwd(), '.env.example') })
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

setCurrentLocale(
  'en',
  mergeTranslations(flatten(dappsEn) as any, flatten(locales.en))
)
