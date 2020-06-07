import { NFTService as NFTServiceInterface } from '../services'

export class NFTService implements NFTServiceInterface {
  fetch(): any {
    throw new Error('Method: `fetch` is not implemented')
  }

  fetchOne(): any {
    throw new Error('Method: `fetchOne` is not implemented')
  }

  transfer(): any {
    throw new Error('Method: `transfer` is not implemented')
  }
}
