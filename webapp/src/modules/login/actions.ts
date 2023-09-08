import { action } from 'typesafe-actions'

// Open Login
export const OPEN_LOGIN = 'Open Login'
export const openLogin = () => action(OPEN_LOGIN, {})
export type OpenLoginAction = ReturnType<typeof openLogin>
