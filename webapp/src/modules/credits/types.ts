export type Credit = {
  amount: string
  availableAmount: string
  contract: string
  expiresAt: string
  id: string
  season: number
  signature: string
  timestamp: string
  userAddress: string
}

export type CreditsResponse = {
  credits: Credit[]
  totalCredits: number
}
