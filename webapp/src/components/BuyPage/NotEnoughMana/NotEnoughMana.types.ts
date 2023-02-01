import React from 'react'
import { Dispatch } from 'redux'
import {
  openBuyManaWithFiatModalRequest,
  OpenBuyManaWithFiatModalRequestAction
} from 'decentraland-dapps/dist/modules/gateway/actions'
import { Asset } from '../../../modules/asset/types'
import {
  openTransak,
  OpenTransakAction
} from '../../../modules/transak/actions'

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
