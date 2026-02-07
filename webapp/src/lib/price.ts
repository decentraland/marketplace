import { ethers } from 'ethers'
import { MAXIMUM_FRACTION_DIGITS } from 'decentraland-dapps/dist/lib/mana'

/**
 * Price utility functions for the marketplace
 * Provides helpers for formatting, validating, and computing prices
 */

/**
 * Formats a wei value to a human-readable string with the specified currency symbol
 * @param wei - The price in wei as a string
 * @param symbol - The currency symbol to prepend (default: 'MANA')
 * @param maximumFractionDigits - Maximum decimal places (default: 2)
 * @returns Formatted price string (e.g., "1,234.56 MANA")
 */
export function formatPrice(
  wei: string,
  symbol = 'MANA',
  maximumFractionDigits: number = MAXIMUM_FRACTION_DIGITS
): string {
  const value = Number(ethers.utils.formatEther(wei))
  
  if (value === 0) {
    return `0 ${symbol}`
  }

  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits
  })

  return `${formattedValue} ${symbol}`
}

/**
 * Formats a price with a compact notation for large values
 * @param wei - The price in wei as a string
 * @param symbol - The currency symbol (default: 'MANA')
 * @returns Compact formatted price (e.g., "1.2M MANA", "500K MANA")
 */
export function formatPriceCompact(wei: string, symbol = 'MANA'): string {
  const value = Number(ethers.utils.formatEther(wei))

  if (value === 0) {
    return `0 ${symbol}`
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M ${symbol}`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K ${symbol}`
  }

  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${symbol}`
}

/**
 * Calculates the percentage difference between two prices
 * @param currentPriceWei - The current price in wei
 * @param previousPriceWei - The previous price in wei
 * @returns The percentage change (positive for increase, negative for decrease)
 */
export function calculatePriceChange(
  currentPriceWei: string,
  previousPriceWei: string
): number {
  const current = Number(ethers.utils.formatEther(currentPriceWei))
  const previous = Number(ethers.utils.formatEther(previousPriceWei))

  if (previous === 0) {
    return current > 0 ? 100 : 0
  }

  return ((current - previous) / previous) * 100
}

/**
 * Formats the price change as a string with + or - prefix and % suffix
 * @param changePercent - The percentage change
 * @returns Formatted change string (e.g., "+15.5%", "-8.2%")
 */
export function formatPriceChange(changePercent: number): string {
  const sign = changePercent >= 0 ? '+' : ''
  return `${sign}${changePercent.toFixed(1)}%`
}

/**
 * Checks if a price is within a given range
 * @param priceWei - The price to check in wei
 * @param minWei - Minimum price in wei (optional)
 * @param maxWei - Maximum price in wei (optional)
 * @returns True if the price is within the range
 */
export function isPriceInRange(
  priceWei: string,
  minWei?: string,
  maxWei?: string
): boolean {
  const price = ethers.BigNumber.from(priceWei)

  if (minWei && price.lt(ethers.BigNumber.from(minWei))) {
    return false
  }

  if (maxWei && price.gt(ethers.BigNumber.from(maxWei))) {
    return false
  }

  return true
}

/**
 * Validates if a string is a valid price input
 * @param value - The string value to validate
 * @returns True if the value is a valid positive number
 */
export function isValidPriceInput(value: string): boolean {
  if (!value || value.trim() === '') {
    return false
  }

  const num = parseFloat(value)
  return !isNaN(num) && num > 0 && isFinite(num)
}

/**
 * Converts an ether value to wei string
 * @param ether - The value in ether (as string or number)
 * @returns The value in wei as a string
 */
export function etherToWei(ether: string | number): string {
  return ethers.utils.parseEther(ether.toString()).toString()
}

/**
 * Converts a wei value to ether number
 * @param wei - The value in wei
 * @returns The value in ether as a number
 */
export function weiToEther(wei: string): number {
  return Number(ethers.utils.formatEther(wei))
}

/**
 * Calculates the total price for multiple items
 * @param priceWei - The unit price in wei
 * @param quantity - The number of items
 * @returns The total price in wei as a string
 */
export function calculateTotalPrice(priceWei: string, quantity: number): string {
  if (quantity <= 0) {
    return '0'
  }
  return ethers.BigNumber.from(priceWei).mul(quantity).toString()
}

/**
 * Compares two prices and returns the comparison result
 * @param priceAWei - First price in wei
 * @param priceBWei - Second price in wei
 * @returns -1 if A < B, 0 if A === B, 1 if A > B
 */
export function comparePrices(priceAWei: string, priceBWei: string): -1 | 0 | 1 {
  const a = ethers.BigNumber.from(priceAWei)
  const b = ethers.BigNumber.from(priceBWei)

  if (a.lt(b)) return -1
  if (a.gt(b)) return 1
  return 0
}

/**
 * Returns the minimum price from an array of prices
 * @param pricesWei - Array of prices in wei
 * @returns The minimum price in wei, or null if array is empty
 */
export function getMinPrice(pricesWei: string[]): string | null {
  if (pricesWei.length === 0) return null

  return pricesWei.reduce((min, price) => {
    return comparePrices(price, min) < 0 ? price : min
  })
}

/**
 * Returns the maximum price from an array of prices
 * @param pricesWei - Array of prices in wei
 * @returns The maximum price in wei, or null if array is empty
 */
export function getMaxPrice(pricesWei: string[]): string | null {
  if (pricesWei.length === 0) return null

  return pricesWei.reduce((max, price) => {
    return comparePrices(price, max) > 0 ? price : max
  })
}

/**
 * Calculates the average price from an array of prices
 * @param pricesWei - Array of prices in wei
 * @returns The average price in wei as a string, or '0' if array is empty
 */
export function getAveragePrice(pricesWei: string[]): string {
  if (pricesWei.length === 0) return '0'

  const sum = pricesWei.reduce(
    (acc, price) => acc.add(ethers.BigNumber.from(price)),
    ethers.BigNumber.from(0)
  )

  return sum.div(pricesWei.length).toString()
}
