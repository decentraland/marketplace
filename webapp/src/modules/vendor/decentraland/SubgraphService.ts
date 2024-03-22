import { config } from '../../../config'

export const SUBGRAPH_WORKER = config.get('SUBGRAPH_WORKER')

export class SubgraphService {
  async fetch<T>(subgraph: string, query: string): Promise<T | undefined> {
    try {
      const options: RequestInit = {
        method: 'POST',
        body: JSON.stringify({
          query
        })
      }

      const response = await fetch(`${SUBGRAPH_WORKER}/${subgraph}`, options)

      if (!response.ok) {
        throw new Error('Network response was not ok.')
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      console.error(error)
    }
  }
}

export default new SubgraphService()
