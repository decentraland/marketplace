import { View } from './types'

const accountViews = new Set<View>([View.ACCOUNT, View.CURRENT_ACCOUNT])

export const isAccountView = (view: View) => accountViews.has(view)
