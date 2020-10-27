import { log, Address } from '@graphprotocol/graph-ts'
import { Update, InitializeCall } from '../entities/LANDRegistry/LANDRegistry'
import { Parcel, NFT } from '../entities/schema'
import { ERC721 } from '../entities/templates'
import { buildCount } from '../modules/count'
import { getNFTId } from '../modules/nft'
import { decodeTokenId, getParcelText } from '../modules/parcel'
import { buildData, DataType } from '../modules/data'
import {
  LANDRegistry,
  EstateRegistry,
  DCLRegistrar,
  BinanceUsCollection,
  ChinaFlying,
  CommunityContestCollection,
  CybermikeCyberSoldier,
  CZMercenaryMTZ,
  DappcraftMoonminerCollection,
  DCGCollection,
  DCLLaunchCollection,
  DCMeta,
  DCNiftyblocksmith,
  DGFall2020,
  DGSummer2020Collection,
  DgtbleHeadspaceCollection,
  DigitalAlchemy,
  EtheremonWearables,
  ExclusiveMasksCollection,
  Halloween2019Collection,
  Halloween2020Collection,
  MCHCollection,
  MFSammichgamer,
  MLPekingopera,
  Moonshot2020Collection,
  PMDreamverseEminence,
  PMOuttathisworldCollection,
  StaySafeCollection,
  SugarclubYumi,
  TechTribalMarc0matic,
  WonderzoneMeteorchaserCollection,
  WonderzoneSteampunk,
  WZWonderbot,
  Xmas2019Collection
} from '../data/addresses'
import * as categories from '../modules/category/categories'
import * as addresses from '../data/addresses'

export function handleInitialize(_: InitializeCall): void {
  let count = buildCount()

  if (count.started == 0) {
    ERC721.create(Address.fromString(LANDRegistry))
    ERC721.create(Address.fromString(EstateRegistry))
    ERC721.create(Address.fromString(DCLRegistrar))

    ERC721.create(Address.fromString(BinanceUsCollection))
    ERC721.create(Address.fromString(CommunityContestCollection))
    ERC721.create(Address.fromString(DappcraftMoonminerCollection))
    ERC721.create(Address.fromString(DCGCollection))
    ERC721.create(Address.fromString(DCLLaunchCollection))
    ERC721.create(Address.fromString(DGSummer2020Collection))
    ERC721.create(Address.fromString(DgtbleHeadspaceCollection))
    ERC721.create(Address.fromString(ExclusiveMasksCollection))
    ERC721.create(Address.fromString(Halloween2019Collection))
    ERC721.create(Address.fromString(Halloween2020Collection))
    ERC721.create(Address.fromString(MCHCollection))
    ERC721.create(Address.fromString(Moonshot2020Collection))
    ERC721.create(Address.fromString(PMOuttathisworldCollection))
    ERC721.create(Address.fromString(StaySafeCollection))
    ERC721.create(Address.fromString(WonderzoneMeteorchaserCollection))
    ERC721.create(Address.fromString(Xmas2019Collection))
    ERC721.create(Address.fromString(ChinaFlying))
    ERC721.create(Address.fromString(CybermikeCyberSoldier))
    ERC721.create(Address.fromString(CZMercenaryMTZ))
    ERC721.create(Address.fromString(DCMeta))
    ERC721.create(Address.fromString(DCNiftyblocksmith))
    ERC721.create(Address.fromString(DGFall2020))
    ERC721.create(Address.fromString(DigitalAlchemy))
    ERC721.create(Address.fromString(EtheremonWearables))
    ERC721.create(Address.fromString(MFSammichgamer))
    ERC721.create(Address.fromString(MLPekingopera))
    ERC721.create(Address.fromString(PMDreamverseEminence))
    ERC721.create(Address.fromString(SugarclubYumi))
    ERC721.create(Address.fromString(TechTribalMarc0matic))
    ERC721.create(Address.fromString(WonderzoneSteampunk))
    ERC721.create(Address.fromString(WZWonderbot))

    count.started = 1
    count.save()
  }
}

export function handleUpdate(event: Update): void {
  let parcelId = event.params.assetId.toString()
  let data = event.params.data.toString()

  let id = getNFTId(categories.PARCEL, addresses.LANDRegistry, parcelId)

  let parcel = new Parcel(id)
  parcel.rawData = data

  let parcelData = buildData(id, data, DataType.PARCEL)
  if (parcelData != null) {
    parcel.data = id
    parcelData.save()

    let coordinates = decodeTokenId(event.params.assetId)
    parcel.x = coordinates[0]
    parcel.y = coordinates[1]

    let nft = new NFT(id)
    nft.name = parcelData.name
    nft.searchText = getParcelText(parcel, parcelData.name)
    nft.save()
  }

  parcel.save()
}
