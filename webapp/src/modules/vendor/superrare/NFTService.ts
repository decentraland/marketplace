import { NFTService as NFTServiceInterface } from '../types'

export class NFTService implements NFTServiceInterface {
  fetch(): any {
    throw new Error('Method: `fetch` is not implemented')
  }

  fetchOne(): any {
    throw new Error('Method: `fetchOne` is not implemented')
  }
}
