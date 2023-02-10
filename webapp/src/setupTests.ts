// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import path from 'path'
import { TextEncoder, TextDecoder } from 'util'
import { config } from 'dotenv'
import flatten from 'flat'
import { setCurrentLocale } from 'decentraland-dapps/dist/modules/translation/utils'
import * as locales from './modules/translation/locales'

config({ path: path.resolve(process.cwd(), '.env.example') })
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

setCurrentLocale('en', flatten(locales.en))
