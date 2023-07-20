import { Item } from '@dcl/schemas'

export enum SmartWearableRequiredPermission {
  MOVE_PLAYER = 'move_player',
  TRIGGER_EMOTES = 'trigger_emotes',
  PLAY_MEDIA_CONTENT = 'play_media_content',
  WALLET_INTERACTION = 'wallet_interaction',
  COMMUNICATE_WITH_OTHER_SERVERS = 'communicate_with_other_servers',
  EXCHANGE_DATA = 'exchange_data',
  OPEN_EXTERNAL_LINKS = 'open_external_links'
}

export type Props = {
  item: Item
}

export type MapDispatchProps = {}
export type MapDispatch = {}
