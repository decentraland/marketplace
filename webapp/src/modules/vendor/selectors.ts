import { createSelector } from 'reselect'
import { createMatchSelector } from 'connected-react-router'
import { locations } from '../routing/locations'
import { RootState } from '../reducer'

const vendorBrowseMatchSelector = createMatchSelector<
  RootState,
  {
    vendor: string
  }
>(locations.partner(':vendor'))

export const getVendor = createSelector<
  RootState,
  ReturnType<typeof vendorBrowseMatchSelector>,
  string | null
>(vendorBrowseMatchSelector, match => match?.params.vendor || null)

