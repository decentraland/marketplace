export const locations = {
  atlas: () => '/atlas',
  market: () => '/market',
  address: (address: string) => `/addresses/${address}`,
  ntf: (contract: string, id: string) => `/contracts/${contract}/id/${id}`
}
