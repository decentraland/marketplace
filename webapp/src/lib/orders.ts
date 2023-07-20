import { Order } from '@dcl/schemas'

export function getIsLegacyOrderAndShouldHaveExpired(order: Order) {
  console.log('isLegacyOrder(order): ', isLegacyOrder(order))
  return isLegacyOrder(order) && new Date(order.expiresAt / 1000) < new Date()
}

export function isExpiresAtInSeconds(expiresAt: number) {
  // Convert the expiresAt value to a string to check its length
  const expiresAtString = expiresAt.toString()

  // Check if the length is 10 digits (seconds since Unix epoch)
  if (expiresAtString.length === 10) {
    return true
  }

  // Check if the length is 13 digits (milliseconds since Unix epoch)
  if (expiresAtString.length === 13) {
    return false
  }
  return false
}

export function getExpiresAtInMiliSeconds(expiresAt: number) {
  // Check if the expiresAt value is in seconds
  if (isExpiresAtInSeconds(expiresAt)) {
    // Convert the expiresAt value to miliseconds
    return expiresAt * 1000
  }

  return expiresAt
}

export function getIsOrderExpired(expiresAt: number) {
  const isExpired = getExpiresAtInMiliSeconds(expiresAt) < Date.now()
  console.log('isExpired: ', isExpired)
  return getExpiresAtInMiliSeconds(expiresAt) < Date.now()
}

export function isLegacyOrder(order: Order) {
  return !isExpiresAtInSeconds(order.expiresAt)
}
