import { Dispatch } from 'redux'
import { Asset } from '../../../modules/asset/types'
import {
  openTransak,
  OpenTransakAction
} from '../../../modules/transak/actions'
import {
  openBuyManaWithFiatModalRequest,
  OpenBuyManaWithFiatModalRequestAction
} from 'decentraland-dapps/dist/modules/gateway/actions'
import React from 'react'

export type Props = {
  asset: Asset
  description: React.ReactNode
  onGetMana: typeof openBuyManaWithFiatModalRequest
  onBuyWithCard: (asset: Asset) => ReturnType<typeof openTransak>
}

export type MapDispatchProps = Pick<Props, 'onGetMana' | 'onBuyWithCard'>
export type MapDispatch = Dispatch<
  OpenTransakAction | OpenBuyManaWithFiatModalRequestAction
>
