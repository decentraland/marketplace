import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Item } from '@dcl/schemas'
import { Button, Icon, ToastType } from 'decentraland-ui'
import { Toast } from 'decentraland-dapps/dist/modules/toast/types'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { config } from '../../config'
import { getAssetName } from '../asset/utils'
import { UpsertRentalOptType } from '../rental/types'
import { locations } from '../routing/locations'
import { NFT } from '../nft/types'
import {
  bulkPickUnpickRequest,
  pickItemAsFavoriteRequest,
  undoUnpickingItemAsFavoriteRequest,
  unpickItemAsFavoriteRequest
} from '../favorites/actions'
import { AssetType } from '../asset/types'
import { Section } from '../vendor/decentraland'
import { View } from '../ui/types'
import { List } from '../favorites/types'
import {
  ListOfLists,
  UpdateOrCreateList
} from '../vendor/decentraland/favorites/types'
import { toastDispatchableActionsChannel } from './utils'
import {
  BulkPickUnpickMessageType,
  BulkPickUnpickSuccessOrFailureType,
  DispatchableFromToastActions
} from './types'

const DEFAULT_TIMEOUT = 6000

const ToastCTA = ({
  action,
  description
}: {
  action: DispatchableFromToastActions
  description: string
}) => {
  const onClick = useCallback(
    () => toastDispatchableActionsChannel.put(action),
    [action]
  )
  return (
    <Button as="a" className="no-padding" basic onClick={onClick}>
      {description}
    </Button>
  )
}

export function getStoreUpdateSuccessToast(): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.store_update_success.title'),
    body: t('toast.store_update_success.body'),
    timeout: DEFAULT_TIMEOUT,
    closable: true
  }
}

export function getLandClaimedBackSuccessToast(): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.claim_land_success.title'),
    body: t('toast.claim_land_success.body'),
    timeout: DEFAULT_TIMEOUT,
    closable: true
  }
}

export function getListingRemoveSuccessToast(): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.remove_listing_success.title'),
    body: t('toast.remove_listing_success.body'),
    timeout: DEFAULT_TIMEOUT,
    closable: true
  }
}

export function getUpsertRentalSuccessToast(
  nft: NFT,
  type: UpsertRentalOptType
): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title:
      type === UpsertRentalOptType.INSERT
        ? t('toast.create_rental_success.title')
        : t('toast.update_rental_success.title'),
    body: (
      <div>
        <p>
          {type === UpsertRentalOptType.INSERT
            ? t('toast.create_rental_success.body')
            : t('toast.update_rental_success.body')}
        </p>
        <Button as={'a'} href={locations.nft(nft.contractAddress, nft.tokenId)}>
          {t('toast.upsert_rental_success.show_listing')}
        </Button>
      </div>
    ),
    timeout: DEFAULT_TIMEOUT,
    closable: true
  }
}

export function getBuyNFTWithCardErrorToast(): Omit<Toast, 'id'> {
  return {
    type: ToastType.ERROR,
    title: t('toast.buy_nft_with_card_error.title'),
    body: (
      <div className="buy-nft-with-card-error">
        <p>{t('toast.buy_nft_with_card_error.body')}</p>
        <Button as="a" basic href={window.location.href}>
          {t('toast.buy_nft_with_card_error.refresh')}
        </Button>
      </div>
    ),
    closable: true,
    icon: <Icon size="big" name="exclamation circle" />
  }
}

export function getExecuteOrderFailureToast(): Omit<Toast, 'id'> {
  return {
    type: ToastType.ERROR,
    title: t('toast.meta_transaction_failure.title'),
    body: (
      <p>
        {t('toast.meta_transaction_failure.body', {
          discord_link: (
            <a href={config.get('DISCORD_URL')}>{t('global.discord_server')}</a>
          ),
          br: <br />
        })}
      </p>
    ),
    icon: <Icon size="big" name="exclamation circle" />,
    closable: true
  }
}

export function getPickItemAsFavoriteSuccessToast(
  item: Item
): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.pick_item_as_favorite_success.title'),
    // TODO (lists): redirect to the chosen list
    body: (
      <div className="list-flow-toast">
        <p>
          {t('toast.pick_item_as_favorite_success.body', {
            name: getAssetName(item)
          })}
        </p>
        <Button
          as="a"
          basic
          className="no-padding"
          href={locations.defaultList()}
        >
          {t('toast.pick_item_as_favorite_success.view_my_lists')}
        </Button>
      </div>
    ),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="big" name="bookmark" />
  }
}

export function getPickItemAsFavoriteFailureToast(
  item: Item
): Omit<Toast, 'id'> {
  return {
    type: ToastType.ERROR,
    title: t('toast.pick_item_as_favorite_failure.title'),
    body: (
      <div className="list-flow-toast">
        <p>
          {t('toast.pick_item_as_favorite_failure.body', {
            name: getAssetName(item)
          })}
        </p>
        <ToastCTA
          action={pickItemAsFavoriteRequest(item)}
          description={t('toast.pick_item_as_favorite_failure.try_again')}
        />
      </div>
    ),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="big" name="exclamation circle" />
  }
}

export function getUnpickItemAsFavoriteSuccessToast(
  item: Item
): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.unpick_item_as_favorite_success.title'),
    body: (
      <div className="list-flow-toast">
        <p>
          {t('toast.unpick_item_as_favorite_success.body', {
            name: getAssetName(item)
          })}
        </p>
        <ToastCTA
          action={undoUnpickingItemAsFavoriteRequest(item)}
          description={t('toast.unpick_item_as_favorite_success.undo')}
        />
      </div>
    ),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="big" name="trash" />
  }
}

export function getUnpickItemAsFavoriteFailureToast(
  item: Item
): Omit<Toast, 'id'> {
  return {
    type: ToastType.ERROR,
    title: t('toast.unpick_item_as_favorite_failure.title'),
    body: (
      <div className="list-flow-toast">
        <p>
          {t('toast.unpick_item_as_favorite_failure.body', {
            name: getAssetName(item)
          })}
        </p>
        <ToastCTA
          action={unpickItemAsFavoriteRequest(item)}
          description={t('toast.unpick_item_as_favorite_failure.try_again')}
        />
      </div>
    ),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="big" name="exclamation circle" />
  }
}

export function getFetchAssetsFailureToast(error: string): Omit<Toast, 'id'> {
  return {
    type: ToastType.ERROR,
    title: t('toast.fetch_assets_failure.title', {
      error: error.toLowerCase()
    }),
    body: t('toast.fetch_assets_failure.body', {
      reload_page: (
        <a href={window.location.href}>
          {t('toast.fetch_assets_failure.reload_page')}
        </a>
      )
    }),
    icon: <Icon size="big" name="exclamation circle" />,
    closable: true,
    timeout: DEFAULT_TIMEOUT
  }
}

export function getUpdateListSuccessToast(
  list: UpdateOrCreateList
): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.update_list_success.title'),
    body: t('toast.update_list_success.body', {
      name: list.name,
      b: (children: React.ReactChildren) => <b>{children}</b>
    }),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="large" circular color="green" inverted name="checkmark" />
  }
}

export function getDeleteListSuccessToast(list: List): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.delete_list_success.title'),
    body: t('toast.delete_list_success.body', {
      name: list.name,
      b: (children: React.ReactChildren) => <b>{children}</b>
    }),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="large" circular color="green" inverted name="checkmark" />
  }
}

export function getDeleteListFailureToast(list: List): Omit<Toast, 'id'> {
  return {
    type: ToastType.ERROR,
    title: t('toast.delete_list_failure.title'),
    body: t('toast.delete_list_failure.body', {
      name: list.name,
      b: (children: React.ReactChildren) => <b>{children}</b>
    }),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="large" name="exclamation circle" />
  }
}

function buildBulkPickItemBodyMessage(
  addOrRemove: BulkPickUnpickMessageType,
  successOrFailure: BulkPickUnpickSuccessOrFailureType,
  item: Item,
  lists: ListOfLists[]
) {
  const count = lists.length === 1 ? 'one' : lists.length === 2 ? 'two' : 'many'
  return (
    <T
      id={`toast.bulk_pick.${successOrFailure}.body.${addOrRemove}.${count}`}
      values={{
        item_name: <b>{getAssetName(item)}</b>,
        count: lists.length,
        first_list_name: (
          <b>
            <Link
              to={locations.list(lists[0]?.id ?? '', {
                assetType: AssetType.ITEM,
                page: 1,
                section: Section.LISTS,
                view: View.LISTS
              })}
            >
              {lists[0]?.name ?? ''}
            </Link>
          </b>
        ),
        second_list_name: (
          <b>
            <Link
              to={locations.list(lists[1]?.id ?? '', {
                assetType: AssetType.ITEM,
                page: 1,
                section: Section.LISTS,
                view: View.LISTS
              })}
            >
              {lists[1]?.name ?? ''}
            </Link>
          </b>
        )
      }}
    />
  )
}

export function getBulkPickItemSuccessToast(
  item: Item,
  pickedFor: ListOfLists[],
  unpickedFrom: ListOfLists[]
): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.bulk_pick.success.title'),
    body: (
      <div className="list-flow-toast">
        <p>
          {pickedFor.length > 0
            ? buildBulkPickItemBodyMessage(
                BulkPickUnpickMessageType.ADD,
                BulkPickUnpickSuccessOrFailureType.SUCCESS,
                item,
                pickedFor
              )
            : undefined}
          {pickedFor.length > 0 && unpickedFrom.length > 0 ? ' ' : undefined}
          {unpickedFrom.length > 0
            ? buildBulkPickItemBodyMessage(
                BulkPickUnpickMessageType.REMOVE,
                BulkPickUnpickSuccessOrFailureType.SUCCESS,
                item,
                unpickedFrom
              )
            : undefined}
        </p>
        <ToastCTA
          action={bulkPickUnpickRequest(item, unpickedFrom, pickedFor)}
          description={t('toast.bulk_pick.success.undo')}
        />
      </div>
    ),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="big" name="bookmark" />
  }
}

export function getBulkPickItemFailureToast(
  item: Item,
  pickedFor: ListOfLists[],
  unpickedFrom: ListOfLists[]
): Omit<Toast, 'id'> {
  return {
    type: ToastType.ERROR,
    title: t('toast.bulk_pick.failure.title'),
    body: (
      <div className="list-flow-toast">
        <p>
          {pickedFor.length > 0
            ? buildBulkPickItemBodyMessage(
                BulkPickUnpickMessageType.ADD,
                BulkPickUnpickSuccessOrFailureType.FAILURE,
                item,
                pickedFor
              )
            : undefined}
          {pickedFor.length > 0 && unpickedFrom.length > 0 ? ' ' : undefined}
          {unpickedFrom.length > 0
            ? buildBulkPickItemBodyMessage(
                BulkPickUnpickMessageType.REMOVE,
                BulkPickUnpickSuccessOrFailureType.FAILURE,
                item,
                unpickedFrom
              )
            : undefined}
        </p>
        <ToastCTA
          action={bulkPickUnpickRequest(item, pickedFor, unpickedFrom)}
          description={t('toast.bulk_pick.failure.try_again')}
        />
      </div>
    ),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="big" name="exclamation circle" />
  }
}
