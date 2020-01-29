export const MANA_SYMBOL = '⏣'

export const formatMANA = (price: string) =>
  Math.abs(+price / 10 ** 18).toLocaleString()
