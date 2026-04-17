export const getBasename = (): string => {
  return /^decentraland\.(zone|org|today)$/.test(window.location.host) ? '/marketplace' : ''
}
