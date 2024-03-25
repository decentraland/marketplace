import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { NFTCategory, RentalStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Popup as UIPopup, Atlas as AtlasComponent, AtlasTile, Color, Layer } from 'decentraland-ui'
import { isErrorWithMessage } from '../../lib/error'
import { NFT } from '../../modules/nft/types'
import { locations } from '../../modules/routing/locations'
import { VendorName } from '../../modules/vendor'
import { nftAPI } from '../../modules/vendor/decentraland/nft/api'
import ErrorBanner from '../ErrorBanner'
import Popup from './Popup'
import { Props, Tile } from './Atlas.types'
import './Atlas.css'

const getCoords = (x: number | string, y: number | string) => `${x},${y}`

const Atlas: React.FC<Props> = (props: Props) => {
  const {
    tiles,
    onNavigate,
    isEstate,
    withNavigation,
    nfts,
    nftsOnRent,
    withPopup,
    showOnSale,
    showForRent,
    showOwned,
    tilesByEstateId,
    withMapColorsInfo,
    withZoomControls,
    lastAtlasModifiedDate,
    getContract,
    children,
    lastUpdated
  } = props

  const [showPopup, setShowPopup] = useState(false)
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false)
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null)
  const [mouseX, setMouseX] = useState(-1)
  const [mouseY, setMouseY] = useState(-1)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selection = useMemo(
    () => (props.selection || []).reduce((set, pair) => set.add(getCoords(pair.x, pair.y)), new Set<string>()),
    [props.selection]
  )

  const setLand = useCallback(
    (lands: Map<string, ReturnType<Layer>>, nft: NFT, color: Color = Color.SUMMER_RED) => {
      if (nft.vendor === VendorName.DECENTRALAND) {
        switch (nft.category) {
          case NFTCategory.PARCEL: {
            const parcel = (nft as NFT<VendorName.DECENTRALAND>).data.parcel!
            lands.set(getCoords(parcel.x, parcel.y), {
              color
            })
            break
          }
          case NFTCategory.ESTATE: {
            const estateId = nft.tokenId
            if (estateId in tilesByEstateId) {
              for (const tile of tilesByEstateId[estateId]) {
                lands.set(getCoords(tile.x, tile.y), {
                  color,
                  top: !!tile.top,
                  left: !!tile.left,
                  topLeft: !!tile.topLeft
                })
              }
            }
          }
        }
      }
      return lands
    },
    [tilesByEstateId]
  )

  const userTiles = useMemo(() => nfts.reduce((lands, nft) => setLand(lands, nft), new Map<string, ReturnType<Layer>>()), [nfts, setLand])

  const userRentedTiles = useMemo(
    () =>
      nftsOnRent.reduce(
        (lands, [nft, rental]) => setLand(lands, nft, rental.status === RentalStatus.EXECUTED ? Color.SUNISH : Color.SUMMER_RED),
        new Map<string, ReturnType<Layer>>()
      ),
    [nftsOnRent, setLand]
  )

  const isSelected = useCallback(
    (x: number, y: number) => {
      if (selection.has(getCoords(x, y))) return true
      // This is a workaround to paint the large estates, because GraphQL can return only up to 1000 results
      // and some Estates have more parcels than thats
      if (!tiles) return false
      const id = selection.values().next().value as string
      const center = tiles[id] as Tile
      const tile = tiles[getCoords(x, y)] as Tile
      if (center && tile && center.estate_id && tile.estate_id && center.estate_id === tile.estate_id && isEstate) {
        return true
      }
      return false
    },
    [selection, tiles, isEstate]
  )

  const forSaleOrRentLayer: Layer = useCallback(
    (x: number, y: number) => {
      const key = getCoords(x, y)
      const tile = tiles[key] as AtlasTile & { price?: string }
      if (tile && (('price' in tile && showOnSale) || ('rentalPricePerDay' in tile && showForRent))) {
        return {
          color: '#00d3ff',
          left: !!tile.left,
          top: !!tile.top,
          topLeft: !!tile.topLeft
        }
      }
      return null
    },
    [tiles, showOnSale, showForRent]
  )

  const selectedStrokeLayer: Layer = useCallback(
    (x: number, y: number) => {
      return isSelected(x, y) ? { color: '#ff0044', scale: 1.4 } : null
    },
    [isSelected]
  )

  const selectedFillLayer: Layer = useCallback(
    (x: number, y: number) => {
      return isSelected(x, y) ? { color: '#ff9990', scale: 1.2 } : null
    },
    [isSelected]
  )

  const allUserTiles = useMemo(() => new Map([...userTiles].concat([...userRentedTiles])), [userRentedTiles, userTiles])

  const userLayer: Layer = useCallback(
    (x: number, y: number) => {
      const tile = allUserTiles.get(getCoords(x, y))
      if (showOwned && tile) {
        return tile
      }
      return null
    },
    [allUserTiles, showOwned]
  )

  const handleClick = useCallback(
    async (x: number, y: number) => {
      if (!withNavigation) {
        return
      }
      const tile = tiles[getCoords(x, y)] as Tile
      if (!tile) {
        return
      }

      if (tile.estate_id) {
        const estates = getContract({
          category: NFTCategory.ESTATE
        })
        estates && onNavigate(locations.nft(estates.address, tile.estate_id))
      } else {
        try {
          const land = getContract({
            category: NFTCategory.PARCEL
          })
          const tokenId = await nftAPI.fetchTokenId(tile.x, tile.y)
          land && onNavigate(locations.nft(land.address, tokenId ?? undefined))
        } catch (error) {
          const errorMessage = isErrorWithMessage(error) ? error.message : t('global.unknown_error')
          console.warn(`Couldn't fetch parcel ${tile.x},${tile.y}: ${errorMessage}`)
        }
      }
    },
    [withNavigation, tiles, getContract, onNavigate]
  )

  const handleHover = useCallback(
    (x: number, y: number) => {
      if (!withPopup) return
      if (selection.has(getCoords(x, y))) {
        setShowPopup(false)
        return
      }
      const id = getCoords(x, y)
      const tile = tiles[id]
      const tileRent = tile
        ? nftsOnRent.find(([nft]) =>
            nft.data.parcel ? Number(nft.data.parcel.x) === tile.x && Number(nft.data.parcel.y) === tile.y : null
          )
        : null

      if (tile && tileRent && tileRent[1].lessor) {
        tile.owner = tileRent[1].lessor
      }

      if (tile && !showPopup) {
        setShowPopup(true)
        setHoveredTile(tile)
        setMouseX(-1)
        setMouseY(-1)
      } else if (tile && tile !== hoveredTile) {
        setHoveredTile(tile)
        setMouseX(-1)
        setMouseY(-1)
      } else if (!tile && showPopup) {
        setShowPopup(false)
      }
    },
    [withPopup, selection, tiles, showPopup, hoveredTile, nftsOnRent]
  )

  const handleHidePopup = useCallback(() => {
    setShowPopup(false)
    setMouseX(-1)
    setMouseY(-1)
  }, [])

  // fade effect
  useEffect(() => {
    if (!showPopup) {
      timeout.current = setTimeout(() => setHoveredTile(null), 250)
    } else if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
  }, [showPopup])

  // mouse move
  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (showPopup && mouseX === -1 && mouseY === -1) {
        setMouseX(event.offsetX)
        setMouseY(event.offsetY)
        setX(event.offsetX)
        setY(event.offsetY)
      }
    }
    if (withPopup) {
      document.addEventListener('mousemove', handleMouseMove)
    }
    return () => {
      if (withPopup) {
        document.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [withPopup, showPopup, mouseX, mouseY])

  const handleInfoPopupOpen = useCallback(() => setIsInfoPopupOpen(true), [setIsInfoPopupOpen])

  const handleInfoPopupClose = useCallback(
    (evt: React.MouseEvent) => {
      evt.stopPropagation()
      setIsInfoPopupOpen(false)
    },
    [setIsInfoPopupOpen]
  )

  // layers
  const layers = [userLayer, ...(props.layers || []), selectedStrokeLayer, selectedFillLayer]

  if (showOnSale || showForRent) {
    layers.unshift(forSaleOrRentLayer)
  }

  return (
    <div className="atlas-wrapper" onMouseLeave={handleHidePopup}>
      {withMapColorsInfo && (
        <UIPopup
          content={
            <div className="atlas-references-container">
              <h3 className="references-title">{t('nft_filters.map.map_colors')}</h3>
              <div className="atlas-references">
                <span className="reference plaza">{t('nft_filters.map.plaza')}</span>
                <span className="reference owned">{t('nft_filters.map.owned_land')}</span>
                <span className="reference rented">{t('nft_filters.map.rented_land')}</span>
                <span className="reference sale">{t('nft_filters.map.sale_or_rent')}</span>
                <span className="reference taken">{t('nft_filters.map.taken')}</span>
              </div>
            </div>
          }
          position="top right"
          onClose={handleInfoPopupClose}
          onOpen={handleInfoPopupOpen}
          trigger={
            <Button
              primary
              className={classNames('atlas-info-button', {
                'atlas-info-open': isInfoPopupOpen
              })}
              aria-label="info"
              tabIndex={0}
            >
              <span aria-label="info-icon" className="info-icon" />
            </Button>
          }
          on="click"
        />
      )}
      <AtlasComponent
        {...props}
        tiles={tiles}
        onClick={handleClick}
        onHover={handleHover}
        layers={layers}
        withZoomControls={withZoomControls}
      />
      {lastAtlasModifiedDate && lastUpdated && lastUpdated > lastAtlasModifiedDate ? (
        <ErrorBanner
          className="atlas-warning-banner"
          info={t('atlas_updated_warning.info', {
            strong: (text: string) => <strong>{text}</strong>
          })}
        />
      ) : null}
      {hoveredTile ? (
        <Popup x={x} y={y} visible={showPopup} tile={hoveredTile} position={x > window.innerWidth - 280 ? 'left' : 'right'} />
      ) : null}
      {children}
    </div>
  )
}

Atlas.defaultProps = {
  showOnSale: true,
  showForRent: true,
  showOwned: true
}

export default Atlas
