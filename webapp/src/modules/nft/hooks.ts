import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { NFTCategory } from '@dcl/schemas'
import { getContract } from '../contract/selectors'
import { RootState } from '../reducer'
import { useGetNFTAddressAndTokenIdFromCurrentUrl } from '../routing/hooks'
import { EstateSnapshot, getFingerprint, isSameEstateComposition, readEstateSnapshot } from './estate/utils'
import { getData } from './selectors'
import { NFT } from './types'
import { getNFT } from './utils'

export const useGetCurrentNFT = (): NFT | null => {
  const { contractAddress, tokenId } = useGetNFTAddressAndTokenIdFromCurrentUrl()
  const nfts = useSelector(getData)
  return getNFT(contractAddress, tokenId, nfts)
}

// The registry's current fingerprint for an Estate. Use it to tell whether a
// fingerprint recorded earlier — on a bid, on an order — still describes the
// Estate. To sign a new one, use `useEstateSnapshot` instead.
export const useFingerprint = (nft: NFT | null) => {
  const [fingerprint, setFingerprint] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const estate = useSelector((state: RootState) => getContract(state, { category: NFTCategory.ESTATE }))

  const estateId = nft?.category === NFTCategory.ESTATE ? nft.tokenId : undefined
  const chainId = nft?.chainId

  // Keyed on the Estate rather than on the `nft` object: a store refresh hands
  // over a new object for the same Estate on every render, which would otherwise
  // read the registry again each time.
  useEffect(() => {
    if (!estateId || !estate || !chainId) {
      return
    }
    setIsLoading(true)
    getFingerprint(estateId, estate, chainId)
      .then(result => setFingerprint(result))
      .catch(error => console.error(`Error getting fingerprint for nft ${estateId}`, error))
      .finally(() => setIsLoading(false))
  }, [estateId, estate, chainId])

  return [fingerprint, isLoading] as const
}

export enum EstateSnapshotStatus {
  // The asset is not an Estate, so there is no composition to agree on.
  NOT_APPLICABLE = 'not_applicable',
  LOADING = 'loading',
  // The registry could not be read.
  UNAVAILABLE = 'unavailable',
  // The registry holds a different set of LANDs than the one on screen.
  OUT_OF_SYNC = 'out_of_sync',
  READY = 'ready'
}

export type EstateSnapshotState = {
  status: EstateSnapshotStatus
  // The fingerprint to send along with a listing, bid or purchase. Only set once
  // the LANDs on screen are the ones the registry holds, so whatever is signed
  // describes the Estate the user was looking at.
  fingerprint?: string
  // What the registry holds, to describe the Estate when it differs from the page.
  snapshot?: EstateSnapshot
  // Re-reads the fingerprint and resolves false when the composition moved since
  // the snapshot was taken, so a stale one can be reported instead of sent.
  confirm: () => Promise<boolean>
  // Reads the registry again. Offered for a read that failed, so that a momentary
  // RPC problem does not keep a flow closed until it is reopened.
  retry: () => void
}

// Reads an Estate's composition from the registry once, when the flow opens, and
// holds on to it. The reference never moves underneath the user: it is the
// composition they are shown and the one they act on.
export const useEstateSnapshot = (nft: NFT | null): EstateSnapshotState => {
  const [snapshot, setSnapshot] = useState<EstateSnapshot>()
  const [hasFailed, setHasFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const estate = useSelector((state: RootState) => getContract(state, { category: NFTCategory.ESTATE }))

  const isEstate = !!nft && nft.category === NFTCategory.ESTATE
  const estateId = isEstate ? nft.tokenId : undefined
  const chainId = nft?.chainId
  const estateAddress = estate?.address

  // Keyed on the Estate rather than on the `nft` object so that a store refresh
  // does not swap the reference the user already has in front of them.
  const readKey = estateId && estateAddress && chainId ? `${chainId}-${estateAddress}-${estateId}#${attempt}` : undefined
  const currentKey = useRef<string>()
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!readKey || !estateId || !estate || !chainId || currentKey.current === readKey) {
      return
    }
    currentKey.current = readKey

    setSnapshot(undefined)
    setHasFailed(false)

    // Guarded on the key rather than on a per-effect flag so that a read still in
    // flight is only discarded when it is for another Estate.
    readEstateSnapshot(estateId, estate, chainId)
      .then(result => {
        if (isMounted.current && currentKey.current === readKey) {
          setSnapshot(result)
        }
      })
      .catch(error => {
        console.error(`Error reading the composition of estate ${estateId}`, error)
        if (isMounted.current && currentKey.current === readKey) {
          setHasFailed(true)
        }
      })
  }, [readKey, estateId, estate, chainId])

  const displayedParcels = isEstate ? nft.data.estate?.parcels : undefined

  const isInSync = useMemo(
    () => !!snapshot && !!displayedParcels && isSameEstateComposition(snapshot.parcels, displayedParcels),
    [snapshot, displayedParcels]
  )

  // Never rejects: a read that cannot be made is reported the same way as one that
  // came back different, so a caller can gate on it without handling both.
  const confirm = useCallback(async () => {
    if (!snapshot || !estateId || !estate || !chainId) {
      return false
    }
    try {
      const current = await getFingerprint(estateId, estate, chainId)
      return current === snapshot.fingerprint
    } catch (error) {
      console.error(`Error re-reading the fingerprint of estate ${estateId}`, error)
      return false
    }
  }, [snapshot, estateId, estate, chainId])

  const retry = useCallback(() => setAttempt(current => current + 1), [])

  return useMemo(() => {
    if (!isEstate) {
      return { status: EstateSnapshotStatus.NOT_APPLICABLE, confirm: () => Promise.resolve(true), retry }
    }
    if (hasFailed) {
      return { status: EstateSnapshotStatus.UNAVAILABLE, confirm, retry }
    }
    if (!snapshot) {
      return { status: EstateSnapshotStatus.LOADING, confirm, retry }
    }
    if (!isInSync) {
      return { status: EstateSnapshotStatus.OUT_OF_SYNC, snapshot, confirm, retry }
    }
    return { status: EstateSnapshotStatus.READY, fingerprint: snapshot.fingerprint, snapshot, confirm, retry }
  }, [isEstate, hasFailed, snapshot, isInSync, confirm, retry])
}

// True while an Estate flow must not let the user act: the registry has not been
// read yet, could not be read, or holds a different set of LANDs than the page.
export const isEstateSnapshotBlocking = (state: EstateSnapshotState): boolean =>
  state.status !== EstateSnapshotStatus.NOT_APPLICABLE && state.status !== EstateSnapshotStatus.READY
