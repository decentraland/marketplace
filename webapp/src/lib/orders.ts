import { Order } from '@dcl/schemas'

export function getIsLegacyOrderAndShouldHaveExpired(order: Order) {
  return isLegacyOrder(order) && new Date(order.expiresAt / 1000) < new Date()
}

export function isExpiresAtInSeconds(expiresAt: number) {
  // Check if the length is 10 digits (seconds since Unix epoch)
  return expiresAt.toString().length === 10
}

export function getExpiresAtInMiliSeconds(expiresAt: number) {
  // Check if the expiresAt value is in seconds
  if (isExpiresAtInSeconds(expiresAt)) {
    // Convert the expiresAt value to miliseconds
    return expiresAt * 1000
  }

  return expiresAt
}

export function getIsLegacyOrderExpired(expiresAt: number) {
  return getExpiresAtInMiliSeconds(expiresAt) < Date.now()
}

export function getIsOrderExpired(expiresAt: number) {
  return expiresAt * 1000 < Date.now()
}

export function isLegacyOrder(order: Order) {
  return !isExpiresAtInSeconds(order.expiresAt)
}
