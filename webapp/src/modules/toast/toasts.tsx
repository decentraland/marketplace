import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Item } from '@dcl/schemas'
import { Toast } from 'decentraland-dapps/dist/modules/toast/types'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Icon, ToastType } from 'decentraland-ui'
import { config } from '../../config'
import { builderUrl } from '../../lib/environment'
import { AssetType } from '../asset/types'
import { getAssetName } from '../asset/utils'
import { bulkPickUnpickRequest } from '../favorites/actions'
import { List } from '../favorites/types'
import { NFT } from '../nft/types'
import { UpsertRentalOptType } from '../rental/types'
import { locations } from '../routing/locations'
import { SortBy } from '../routing/types'
import { View } from '../ui/types'
import { VendorName } from '../vendor'
import { Section } from '../vendor/decentraland'
import { ListOfLists, UpdateOrCreateList } from '../vendor/decentraland/favorites/types'
import { BulkPickUnpickMessageType, BulkPickUnpickSuccessOrFailureType, DispatchableFromToastActions } from './types'
import { toastDispatchableActionsChannel } from './utils'

const DEFAULT_TIMEOUT = 6000

const ToastCTA = ({ action, description }: { action: DispatchableFromToastActions; description: string }) => {
  const onClick = useCallback(() => toastDispatchableActionsChannel.put(action), [action])
  return (
    <Button as="a" className="no-padding" basic onClick={onClick}>
      {description}
    </Button>
  )
}

export function getNameClaimSuccessToast(): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.store_update_success.title'),
    body: (
      <div>
        <p>{t('toast.claim_name_success.body')}</p>
        <Button as="a" href={`${builderUrl}/worlds`}>
          {t('toast.claim_name_success.cta')}
        </Button>
      </div>
    ),
    timeout: DEFAULT_TIMEOUT,
    closable: true
  }
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

export function getUpsertRentalSuccessToast(nft: NFT, type: UpsertRentalOptType): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: type === UpsertRentalOptType.INSERT ? t('toast.create_rental_success.title') : t('toast.update_rental_success.title'),
    body: (
      <div>
        <p>{type === UpsertRentalOptType.INSERT ? t('toast.create_rental_success.body') : t('toast.update_rental_success.body')}</p>
        <Button as={Link} to={locations.nft(nft.contractAddress, nft.tokenId)}>
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
          discord_link: <a href={config.get('DISCORD_URL')}>{t('global.discord_server')}</a>,
          br: <br />
        })}
      </p>
    ),
    icon: <Icon size="big" name="exclamation circle" />,
    closable: true
  }
}

export function getFetchAssetsFailureToast(error: string): Omit<Toast, 'id'> {
  return {
    type: ToastType.ERROR,
    title: t('toast.fetch_assets_failure.title', {
      error: error.toLowerCase()
    }),
    body: t('toast.fetch_assets_failure.body', {
      reload_page: <a href={window.location.href}>{t('toast.fetch_assets_failure.reload_page')}</a>
    }),
    icon: <Icon size="big" name="exclamation circle" />,
    closable: true,
    timeout: DEFAULT_TIMEOUT
  }
}

export function getUpdateListSuccessToast(list: UpdateOrCreateList): Omit<Toast, 'id'> {
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
                view: View.LISTS,
                vendor: VendorName.DECENTRALAND,
                sortBy: SortBy.NEWEST
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
                view: View.LISTS,
                vendor: VendorName.DECENTRALAND,
                sortBy: SortBy.NEWEST
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

export function getBulkPickItemSuccessToast(item: Item, pickedFor: ListOfLists[], unpickedFrom: ListOfLists[]): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: t('toast.bulk_pick.success.title'),
    body: (
      <div className="list-flow-toast">
        <p>
          {pickedFor.length > 0
            ? buildBulkPickItemBodyMessage(BulkPickUnpickMessageType.ADD, BulkPickUnpickSuccessOrFailureType.SUCCESS, item, pickedFor)
            : undefined}
          {pickedFor.length > 0 && unpickedFrom.length > 0 ? ' ' : undefined}
          {unpickedFrom.length > 0
            ? buildBulkPickItemBodyMessage(BulkPickUnpickMessageType.REMOVE, BulkPickUnpickSuccessOrFailureType.SUCCESS, item, unpickedFrom)
            : undefined}
        </p>
        <ToastCTA action={bulkPickUnpickRequest(item, unpickedFrom, pickedFor)} description={t('toast.bulk_pick.success.undo')} />
      </div>
    ),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="big" name="bookmark" />
  }
}

export function getBulkPickItemFailureToast(item: Item, pickedFor: ListOfLists[], unpickedFrom: ListOfLists[]): Omit<Toast, 'id'> {
  return {
    type: ToastType.ERROR,
    title: t('toast.bulk_pick.failure.title'),
    body: (
      <div className="list-flow-toast">
        <p>
          {pickedFor.length > 0
            ? buildBulkPickItemBodyMessage(BulkPickUnpickMessageType.ADD, BulkPickUnpickSuccessOrFailureType.FAILURE, item, pickedFor)
            : undefined}
          {pickedFor.length > 0 && unpickedFrom.length > 0 ? ' ' : undefined}
          {unpickedFrom.length > 0
            ? buildBulkPickItemBodyMessage(BulkPickUnpickMessageType.REMOVE, BulkPickUnpickSuccessOrFailureType.FAILURE, item, unpickedFrom)
            : undefined}
        </p>
        <ToastCTA action={bulkPickUnpickRequest(item, pickedFor, unpickedFrom)} description={t('toast.bulk_pick.failure.try_again')} />
      </div>
    ),
    closable: true,
    timeout: DEFAULT_TIMEOUT,
    icon: <Icon size="big" name="exclamation circle" />
  }
}

export function getCrossChainTransactionSuccessToast(txLink: string): Omit<Toast, 'id'> {
  return {
    type: ToastType.INFO,
    title: '',
    body: (
      <div>
        <p>
          {t('toast.cross_chain_tx.body', {
            br: () => <br />,
            highlight: (text: string) => <span>{text}</span>,
            link: (text: string) => <Link to={locations.activity()}>{text}</Link>
          })}
        </p>
        <Button as="a" href={locations.activity()} target="_blank">
          {t('navigation.activity')}
          <Icon style={{ marginLeft: 6 }} name="clock outline" />
        </Button>
        <Button as="a" href={txLink} target="_blank">
          {t('toast.cross_chain_tx.view_transaction')}
          <Icon style={{ marginLeft: 6 }} name="external" />
        </Button>
      </div>
    ),
    closable: false
  }
}
