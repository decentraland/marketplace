import { BaseAPI } from 'decentraland-dapps/dist/lib/api'

export const ATLAS_URL = process.env.REACT_APP_ATLAS_URL!

class LandAPI extends BaseAPI {
  fetchParcel(x: number | string, y: number | string) {
    return this.request('get', `/parcels/${x}/${y}`)
  }

  fetchEstate(id: string) {
    return this.request('get', `/estates/${id}`)
  }
}

export const landAPI = new LandAPI(ATLAS_URL)
