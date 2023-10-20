import React, { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { ethers, BigNumber } from 'ethers'
import { Squid } from '@0xsquid/sdk'
import { ChainData, Token, RouteResponse } from '@0xsquid/sdk/dist/types'
import { ChainId } from '@dcl/schemas'
import { Button, Dropdown, Loader, ModalNavigation } from 'decentraland-ui'
import { ContractName, getContract } from 'decentraland-transactions'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  getConnectedProvider,
  getNetworkProvider
} from 'decentraland-dapps/dist/lib/eth'
import { getAssetName, isNFT } from '../../../modules/asset/utils'
import { Mana } from '../../Mana'
import { formatWeiMANA } from '../../../lib/mana'
import { AxelarProvider, axelarProvider } from '../../../lib/xchain'
import { AssetImage } from '../../AssetImage'
import { Props } from './BuyWithCryptoModal.types'
import styles from './BuyWithCryptoModal.module.css'
import RouteSummary from './RouteSummary/RouteSummary'

export const CANCEL_DATA_TEST_ID = 'confirm-buy-with-crypto-modal-cancel'
export const CONFIRM_DATA_TEST_ID = 'confirm-buy-with-crypto-modal-confirm'

const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

// const DEFAULT_TOKEN_BY_CHAIN = {
//   [ChainId.ETHEREUM_MAINNET]: 'MANA',
//   [ChainId.MATIC_MUMBAI]: 'MANA'
// }

const DEFAULT_CHAIN = ChainId.MATIC_MUMBAI

export type ProviderChain = ChainData
export type ProviderToken = Token

const BuyWithCryptoModal = (props: Props) => {
  const {
    wallet,
    onClose,
    metadata: { asset, order },
    onSwitchNetwork
  } = props

  const abortControllerRef = useRef(new AbortController())

  const tokenDropdownRef = useRef(null)
  const [squid, setSquid] = useState<Squid>()
  const [selectedChain, setSelectedChain] = useState(
    wallet?.chainId || ChainId.ETHEREUM_MAINNET
  )
  const [providerChains, setProviderChains] = useState<ProviderChain[]>([])
  const [providerTokens, setProviderTokens] = useState<ProviderToken[]>([])
  const [selectedToken, setSelectedToken] = useState<Token>()
  console.log('selectedToken: ', selectedToken)
  // const [selectedTokenPrice, setSelectedTokenPrice] = useState<number>()
  // const [isLoading, setIsLoading] = useState({ balance: false, route: false })
  const [isFetchingBalance, setIsFetchingBalance] = useState(false)
  const [isFetchingRoute, setIsFetchingRoute] = useState(false)
  console.log('isFetchingRoute: ', isFetchingRoute)
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<BigNumber>()
  const [route, setRoute] = useState<RouteResponse>()
  const [routeFailed, setRouteFailed] = useState(false)
  console.log('route: ', route)
  const [canBuyItem, setCanBuyItem] = useState(false)

  // fetch chains & supported tokens
  useEffect(() => {
    ;(async () => {
      // instantiate the SDK
      const squid = new Squid({
        baseUrl: 'https://v2.api.squidrouter.com', // for testnet use "https://testnet.v2.api.squidrouter.com"
        integratorId: 'decentraland-sdk'
      })

      await squid.init()
      setSquid(squid)

      const ALLOWED_CHAINS = [1, 137, 5, 80001, 43113]
      const fromToken = squid.tokens.filter(t =>
        ALLOWED_CHAINS.includes(+t.chainId)
      )
      const fromChain = squid.chains.filter(c =>
        ALLOWED_CHAINS.includes(+c.chainId)
      )
      setProviderChains(fromChain)
      setProviderTokens(fromToken)

      const MANAToken = fromToken.find(t => t.symbol === 'MANA')
      if (MANAToken) {
        console.log('setting it here')
        setSelectedToken(MANAToken)
      }
    })()
  }, [])

  // fetch selected token balance & price
  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        // setIsLoading(prevState => ({ ...prevState, balance: true }))
        setIsFetchingBalance(true)
        if (
          squid &&
          squid.initialized &&
          selectedChain &&
          selectedToken &&
          wallet
        ) {
          const networkProvider = await getNetworkProvider(selectedChain)
          const provider = new ethers.providers.Web3Provider(networkProvider)
          // const fromAmount = await squid.getFromAmount({
          //   fromToken: selectedToken,
          //   toAmount: ,
          //   toToken,
          //   slippagePercentage: 0.5
          // })
          // // const selectedTokenPrice = await squid.getTokenPrice({
          // //   tokenAddress: selectedToken.address,
          // //   chainId: selectedToken.chainId
          // // })

          // if (!cancel) {
          //   setSelectedTokenPrice(selectedTokenPrice)
          // }

          // if native token
          if (selectedToken.address === NATIVE_TOKEN) {
            const balanceWei = await provider.getBalance(wallet.address)
            const balanceEther = ethers.utils.formatEther(balanceWei)
            setSelectedTokenBalance(balanceWei)
            console.log(`Balance of ${wallet.address} is ${balanceEther} ETH`)

            return
          }
          // else ERC20
          const tokenContract = new ethers.Contract(
            selectedToken.address,
            ['function balanceOf(address owner) view returns (uint256)'],
            provider
          )
          const balance: BigNumber = await tokenContract.balanceOf(
            wallet.address
          )

          if (!cancel) {
            setSelectedTokenBalance(balance)
          }
        }
      } catch (error) {
        console.log('error getting balance: ', error)
      } finally {
        if (!cancel) {
          // setIsLoading(prevState => ({ ...prevState, balance: false }))
          setIsFetchingBalance(false)
        }
      }
    })()
    return () => {
      cancel = true
    }
  }, [selectedToken, selectedChain, wallet, squid])

  // check if user can buy item
  useEffect(() => {
    ;(async () => {
      if (
        squid &&
        squid.initialized &&
        selectedTokenBalance &&
        // selectedTokenPrice &&
        !isNFT(asset)
      ) {
        const balance = parseFloat(
          ethers.utils.formatEther(selectedTokenBalance)
        )
        console.log('balance: ', balance)

        const destinyChainMANA = getContract(
          ContractName.MANAToken,
          asset.chainId
        ).address
        // const manaPrice = await squid.getTokenPrice({
        //   tokenAddress: destinyChainMANA,
        //   chainId: asset.chainId
        // })

        // const itemPriceInUSD =
        //   Number(ethers.utils.formatEther(asset.price)) * manaPrice

        // const balanceInUSD = balance * selectedTokenPrice
        // setCanBuyItem(balanceInUSD >= itemPriceInUSD)

        const providerMANA = providerTokens.find(
          t =>
            t.address.toLocaleLowerCase() ===
            destinyChainMANA.toLocaleLowerCase()
        )
        if (providerMANA && selectedToken) {
          const fromAmountParams = {
            fromToken: selectedToken,
            toAmount: ethers.utils.formatEther(
              order ? order.price : !isNFT(asset) ? asset.price : ''
            ),
            toToken: providerMANA
            // slippagePercentage: 0.5
          }
          console.log('fromAmountParams: ', fromAmountParams)
          const fromAmount = Number(
            await squid.getFromAmount(fromAmountParams)
          ).toFixed(6)
          console.log('fromAmount inside useeffect: ', fromAmount)

          if (balance > Number(fromAmount)) {
            setCanBuyItem(true)
          }
        }
      }
    })()
  }, [
    asset,
    order,
    providerTokens,
    selectedToken,
    selectedTokenBalance,
    // selectedTokenPrice,
    squid
  ])

  // reset route when changing token
  useEffect(() => {
    setRouteFailed(false)
    setRoute(undefined)
  }, [selectedToken])

  // calculate route on selectedToken change
  // useEffect(() => {
  //   // if (isFetchingRoute) {
  //   //   return
  //   // }
  //   // let cancel = false

  //   const getRoute = async (
  //     squid: Squid,
  //     wallet: Wallet,
  //     selectedToken: Token,
  //     providerMANA: Token
  //   ) => {
  //     try {
  //       // const destinyChainMANA = getContract(
  //       //   ContractName.MANAToken,
  //       //   asset.chainId
  //       // ).address
  //       // const manaPrice = await squid.getTokenPrice({
  //       //   tokenAddress: destinyChainMANA,
  //       //   chainId: asset.chainId
  //       // })

  //       setIsFetchingRoute(true)
  //       setRouteFailed(false)
  //       // const xChainProvider = new AxelarProvider()
  //       let route: RouteResponse | undefined = undefined

  //       // const fromAmount =
  //       //   (Number(
  //       // ethers.utils.formatEther(
  //       //   order ? order.price : !isNFT(asset) ? asset.price : ''
  //       // )
  //       //   ) *
  //       //     manaPrice) /
  //       //   selectedTokenPrice

  //       const fromAmountParams = {
  //         fromToken: selectedToken,
  //         toAmount: ethers.utils.formatEther(
  //           order ? order.price : !isNFT(asset) ? asset.price : ''
  //         ),
  //         toToken: providerMANA
  //         // slippagePercentage: 0.5
  //       }
  //       console.log('fromAmountParams: ', fromAmountParams)
  //       const fromAmount = Number(
  //         await squid.getFromAmount(fromAmountParams)
  //       ).toFixed(6)

  //       // const balance = parseFloat(
  //       //   ethers.utils.formatEther(selectedTokenBalance)
  //       // )
  //       // console.log('balance: ', balance)

  //       // if (fromAmount > balance) {
  //       //   setRouteFailed(true)
  //       //   return
  //       // }
  //       console.log('fromAmount: ', fromAmount)

  //       // if (!cancel) {
  //       //   setSelectedTokenPrice(selectedTokenPrice)
  //       // }

  //       const fromAmountWei = ethers.utils
  //         .parseUnits(fromAmount, selectedToken.decimals)
  //         .toString()

  //       const baseRouteConfig = {
  //         fromAddress: wallet.address,
  //         fromAmount: fromAmountWei,
  //         fromChain: selectedChain,
  //         fromToken: selectedToken.address
  //       }
  //       // there's an order so it's buying an NFT
  //       console.log('baseRouteConfig: ', baseRouteConfig)
  //       if (order) {
  //         console.log('fetching1')
  //         route = await axelarProvider.getBuyNFTRoute({
  //           ...baseRouteConfig,
  //           nft: {
  //             collectionAddress: order.contractAddress,
  //             tokenId: order.tokenId,
  //             price: order.price
  //           },
  //           toAmount: order.price,
  //           toChain: order.chainId
  //         })
  //       } else if (!isNFT(asset)) {
  //         console.log('fetching2')
  //         // buying an item
  //         route = await axelarProvider.getMintNFTRoute({
  //           ...baseRouteConfig,
  //           item: {
  //             collectionAddress: asset.contractAddress,
  //             itemId: asset.itemId,
  //             price: asset.price
  //           },
  //           toAmount: asset.price,
  //           toChain: asset.chainId
  //         })
  //       }

  //       if (route) {
  //         setRoute(route)
  //       }

  //       // const selectedTokenPrice = await squid.getTokenPrice({
  //       //   tokenAddress: selectedToken.address,
  //       //   chainId: selectedToken.chainId
  //       // })
  //     } catch (error) {
  //       console.log('error: ', error)
  //       setRouteFailed(true)
  //     } finally {
  //       console.log('inside finally')
  //       // if (!cancel) {
  //       setIsFetchingRoute(false)

  //       // }
  //     }
  //   }

  //   const destinyChainMANA = getContract(ContractName.MANAToken, asset.chainId)
  //     .address
  //   const providerMANA = providerTokens.find(
  //     t =>
  //       t.address.toLocaleLowerCase() === destinyChainMANA.toLocaleLowerCase()
  //   )
  //   console.log('providerMANA: ', providerMANA)

  //   if (
  //     squid &&
  //     squid.initialized &&
  //     wallet &&
  //     selectedToken &&
  //     providerMANA &&
  //     !route &&
  //     !isFetchingRoute &&
  //     !routeFailed
  //   ) {
  //     getRoute(squid, wallet, selectedToken, providerMANA)
  //     // try {
  //     // } catch (error) {
  //     //   console.log('inside error: ', error);
  //     //   setIsFetchingRoute(false)
  //     // }
  //   }

  //   // ;(async () => {
  //   //   try {
  //   //     if (squid && squid.initialized && wallet && !isFetchingRoute) {
  //   //       // const selectedTokenPrice = await squid.getTokenPrice({
  //   //       //   tokenAddress: selectedToken.address,
  //   //       //   chainId: selectedToken.chainId
  //   //       // })

  //   //       const destinyChainMANA = getContract(
  //   //         ContractName.MANAToken,
  //   //         asset.chainId
  //   //       ).address
  //   //       // const manaPrice = await squid.getTokenPrice({
  //   //       //   tokenAddress: destinyChainMANA,
  //   //       //   chainId: asset.chainId
  //   //       // })

  //   //       setIsFetchingRoute(true)
  //   //       setRouteFailed(false)
  //   //       const xChainProvider = new AxelarProvider()
  //   //       let route: RouteResponse | undefined = undefined

  //   //       // const fromAmount =
  //   //       //   (Number(
  //   //       // ethers.utils.formatEther(
  //   //       //   order ? order.price : !isNFT(asset) ? asset.price : ''
  //   //       // )
  //   //       //   ) *
  //   //       //     manaPrice) /
  //   //       //   selectedTokenPrice

  //   //       const providerMANA = providerTokens.find(
  //   //         t =>
  //   //           t.address.toLocaleLowerCase() ===
  //   //           destinyChainMANA.toLocaleLowerCase()
  //   //       )

  //   //       const ETH = squid.getTokenData(
  //   //         '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  //   //         '1'
  //   //       )

  //   //       const USDC = squid.getTokenData(
  //   //         '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  //   //         '1'
  //   //       )

  //   //       const usdcToEth = await squid.getFromAmount({
  //   //         fromToken: USDC,
  //   //         toAmount: '1',
  //   //         toToken: ETH
  //   //       }) // expected: ~1600
  //   //       console.log('usdcToEth: ', usdcToEth)

  //   //       const ethToUsdc = await squid.getFromAmount({
  //   //         fromToken: ETH,
  //   //         toAmount: '200',
  //   //         toToken: USDC
  //   //       }) // expected: ~0.12...
  //   //       console.log('ethToUsdc: ', ethToUsdc)

  //   //       if (providerMANA) {
  //   //         const fromAmountParams = {
  //   //           fromToken: selectedToken,
  //   //           toAmount: ethers.utils.formatEther(
  //   //             order ? order.price : !isNFT(asset) ? asset.price : ''
  //   //           ),
  //   //           toToken: providerMANA
  //   //           // slippagePercentage: 0.5
  //   //         }
  //   //         console.log('fromAmountParams: ', fromAmountParams)
  //   //         const fromAmount = Number(
  //   //           await squid.getFromAmount(fromAmountParams)
  //   //         ).toFixed(6)
  //   //         console.log('fromAmount: ', fromAmount)

  //   //         if (!cancel) {
  //   //           setSelectedTokenPrice(selectedTokenPrice)
  //   //         }
  //   //         const fromAmountWei = ethers.utils
  //   //           .parseUnits(fromAmount, selectedToken.decimals)
  //   //           .toString()

  //   //         const baseRouteConfig = {
  //   //           fromAddress: wallet.address,
  //   //           fromAmount: fromAmountWei,
  //   //           fromChain: selectedChain,
  //   //           fromToken: selectedToken.address
  //   //         }
  //   //         // there's an order so it's buying an NFT
  //   //         if (order) {
  //   //           route = await xChainProvider.getBuyNFTRoute({
  //   //             ...baseRouteConfig,
  //   //             nft: {
  //   //               collectionAddress: order.contractAddress,
  //   //               tokenId: order.tokenId,
  //   //               price: order.price
  //   //             },
  //   //             toAmount: order.price,
  //   //             toChain: order.chainId
  //   //           })
  //   //         } else if (!isNFT(asset)) {
  //   //           // buying an item
  //   //           route = await xChainProvider.getMintNFTRoute({
  //   //             ...baseRouteConfig,
  //   //             item: {
  //   //               collectionAddress: asset.contractAddress,
  //   //               itemId: asset.itemId,
  //   //               price: asset.price
  //   //             },
  //   //             toAmount: asset.price,
  //   //             toChain: asset.chainId
  //   //           })
  //   //         }
  //   //       }

  //   //       // const selectedTokenPrice = await squid.getTokenPrice({
  //   //       //   tokenAddress: selectedToken.address,
  //   //       //   chainId: selectedToken.chainId
  //   //       // })

  //   //       if (!cancel) {
  //   //         if (route) {
  //   //           setRoute(route)
  //   //         }
  //   //       }
  //   //     }
  //   //   } catch (error) {
  //   //     console.log('error getting route: ', error)
  //   //     setRouteFailed(true)
  //   //     // TODO: track that route failed
  //   //   } finally {
  //   //     if (!cancel) {
  //   //       setIsFetchingRoute(false)
  //   //     }
  //   //   }
  //   // })()

  //   // return () => {
  //   //   cancel = true
  //   // }
  // }, [
  //   asset,
  //   isFetchingRoute,
  //   order,
  //   providerTokens,
  //   route,
  //   routeFailed,
  //   selectedChain,
  //   selectedToken,
  //   selectedTokenBalance,
  //   // selectedTokenPrice,
  //   squid,
  //   wallet
  // ])

  const calculateRoute = useCallback(
    async (selectedToken: Token) => {
      const abortController = abortControllerRef.current
      const signal = abortController.signal
      const destinyChainMANA = getContract(
        ContractName.MANAToken,
        asset.chainId
      ).address
      const providerMANA = providerTokens.find(
        t =>
          t.address.toLocaleLowerCase() === destinyChainMANA.toLocaleLowerCase()
      )
      if (
        !squid ||
        !squid.initialized ||
        !wallet ||
        !selectedToken ||
        !providerMANA
      ) {
        return
      }
      try {
        // const destinyChainMANA = getContract(
        //   ContractName.MANAToken,
        //   asset.chainId
        // ).address
        // const manaPrice = await squid.getTokenPrice({
        //   tokenAddress: destinyChainMANA,
        //   chainId: asset.chainId
        // })

        setIsFetchingRoute(true)
        setRouteFailed(false)
        // const xChainProvider = new AxelarProvider()
        let route: RouteResponse | undefined = undefined

        // const fromAmount =
        //   (Number(
        // ethers.utils.formatEther(
        //   order ? order.price : !isNFT(asset) ? asset.price : ''
        // )
        //   ) *
        //     manaPrice) /
        //   selectedTokenPrice

        const fromAmountParams = {
          fromToken: selectedToken,
          toAmount: ethers.utils.formatEther(
            order ? order.price : !isNFT(asset) ? asset.price : ''
          ),
          toToken: providerMANA
          // slippagePercentage: 0.5
        }
        console.log('fromAmountParams: ', fromAmountParams)
        const fromAmount = Number(
          await squid.getFromAmount(fromAmountParams)
        ).toFixed(6)
        console.log('fromAmount: ', fromAmount)

        const fromAmountWei = ethers.utils
          .parseUnits(fromAmount, selectedToken.decimals)
          .toString()

        const baseRouteConfig = {
          fromAddress: wallet.address,
          fromAmount: fromAmountWei,
          fromChain: selectedChain,
          fromToken: selectedToken.address
        }
        // there's an order so it's buying an NFT
        console.log('baseRouteConfig: ', baseRouteConfig)
        if (order) {
          console.log('fetching1')
          route = await axelarProvider.getBuyNFTRoute({
            ...baseRouteConfig,
            nft: {
              collectionAddress: order.contractAddress,
              tokenId: order.tokenId,
              price: order.price
            },
            toAmount: order.price,
            toChain: order.chainId
          })
        } else if (!isNFT(asset)) {
          console.log('fetching2')
          // buying an item
          route = await axelarProvider.getMintNFTRoute({
            ...baseRouteConfig,
            item: {
              collectionAddress: asset.contractAddress,
              itemId: asset.itemId,
              price: asset.price
            },
            toAmount: asset.price,
            toChain: asset.chainId
          })
        }

        console.log('signal.aborted in route ', signal.aborted, route)
        if (route && !signal.aborted) {
          setRoute(route)
        }

        // const selectedTokenPrice = await squid.getTokenPrice({
        //   tokenAddress: selectedToken.address,
        //   chainId: selectedToken.chainId
        // })
      } catch (error) {
        console.log('error: ', error)
        setRouteFailed(true)
      } finally {
        console.log('inside finally')
        // if (!cancel) {
        setIsFetchingRoute(false)

        // }
      }
    },
    [asset, order, providerTokens, selectedChain, squid, wallet]
  )

  // when changing the chain, reset the selected token to MANA
  // useEffect(() => {
  //   const manaToken = providerTokens.find(
  //     t => t.symbol === 'MANA' && t.chainId === selectedChain.toString()
  //   )
  //   setSelectedToken(manaToken)
  //   setSelectedTokenBalance(undefined)
  //   setRouteFailed(false)
  //   setRoute(undefined)
  //   if (manaToken) {
  //     calculateRoute(manaToken)
  //   }
  // }, [calculateRoute, providerTokens, selectedChain])

  const onBuy = useCallback(async () => {
    const provider = await getConnectedProvider()
    if (route && squid && squid.initialized && provider) {
      // const networkProvider = await getNetworkProvider(selectedChain)
      // const tx = await axelarProvider.executeRoute(route, networkProvider)

      const signer = await new ethers.providers.Web3Provider(
        provider
      ).getSigner()

      console.log('signer: ', signer)
      console.log('route.route: ', route.route)
      // tslint:disable-next-line
      // @ts-ignore
      const txResponse = (await squid.executeRoute({
        route: route.route,
        signer
      })) as ethers.providers.TransactionResponse

      const tx = await txResponse.wait()
      // Step 5: With hash, you can check the transaction on the blockchain & Axelarscan
      const axelarScanUrl = `https://axelarscan.io/gmp/${tx.transactionHash}`
      console.log('axelarScanUrl: ', axelarScanUrl)
      console.log('Follow your transaction here: ', axelarScanUrl)
    }
  }, [route, squid])

  return (
    <Modal size="tiny" onClose={onClose} className={styles.buyWithCryptoModal}>
      <ModalNavigation
        title={t('buy_with_crypto.title', {
          name: asset.name,
          b: (children: React.ReactChildren) => <b>{children}</b>
        })}
        onClose={onClose}
      />
      <Modal.Content>
        <>
          <div>
            <span className={styles.subtitle}>
              {t('buy_with_crypto.subtitle', {
                name: <b>{getAssetName(asset)}</b>,
                amount: (
                  <Mana showTooltip network={asset.network} inline withTooltip>
                    {formatWeiMANA(
                      order ? order.price : !isNFT(asset) ? asset.price : ''
                    )}
                  </Mana>
                )
              })}
            </span>
            <div className={styles.assetContainer}>
              <AssetImage asset={asset} isSmall />
            </div>
          </div>

          {!providerTokens.length || !selectedToken ? (
            <Loader className={styles.mainLoader} active />
          ) : (
            <>
              <div className={styles.dropdownContainer}>
                <div>
                  <span>{t('buy_with_crypto.choose_chain')}</span>
                  <Dropdown
                    // disabled={isFetchingRoute}
                    className={classNames(
                      styles.dcl_dropdown
                      // styles.token_dropdown
                    )}
                    value={selectedChain}
                    options={providerChains.map(chain => ({
                      text: chain.networkName,
                      value: +chain.chainId,
                      image: { avatar: true, src: chain.nativeCurrency.icon }
                    }))}
                    onChange={(_, data) => {
                      setSelectedChain(data.value as any)
                      onSwitchNetwork(data.value as ChainId)
                    }}
                  />
                </div>
                <div className={styles.tokenDropdownContainer}>
                  <span>{t('buy_with_crypto.choose_token')}</span>
                  <Dropdown
                    ref={tokenDropdownRef}
                    // disabled={isFetchingRoute}
                    className={classNames(
                      styles.dcl_dropdown,
                      styles.token_dropdown
                    )}
                    search
                    scrolling
                    value={selectedToken?.address}
                    options={providerTokens
                      .filter(
                        token => token.chainId === selectedChain.toString()
                      )
                      .map(token => ({
                        text: token.symbol,
                        value: token.address,
                        image: { avatar: true, src: token.logoURI }
                      }))}
                    onChange={(_, data) => {
                      abortControllerRef.current.abort()
                      console.log('tokenDropdownRef: ', tokenDropdownRef)
                      // walk-around to remove focus from the dropdown component from semantic
                      setTimeout(() => {
                        ;(tokenDropdownRef.current as any).ref.current.firstElementChild.blur()
                      }, 100)

                      const selectedToken = providerTokens.find(
                        t => t.address === data.value
                      ) as Token
                      setSelectedToken(selectedToken)
                      abortControllerRef.current = new AbortController()
                      calculateRoute(selectedToken)
                    }}
                  />
                </div>
              </div>
              <div className={styles.balance_container}>
                {selectedTokenBalance ? (
                  <span>
                    {t('buy_with_crypto.balance')}:{' '}
                    {ethers.utils
                      .formatEther(selectedTokenBalance)
                      .toString()
                      .slice(0, 6)}
                  </span>
                ) : null}
              </div>

              <RouteSummary route={route} selectedToken={selectedToken} />

              {routeFailed && selectedToken ? (
                <span className={styles.routeUnavailable}>
                  {' '}
                  {t('buy_with_crypto.route_unavailable', {
                    token: selectedToken.symbol
                  })}
                </span>
              ) : null}
              {!canBuyItem ? (
                <span className={styles.insufficientFunds}>
                  {t('buy_with_crypto.insufficient_funds', {
                    token: selectedToken.symbol
                  })}
                </span>
              ) : null}
            </>
          )}
        </>
      </Modal.Content>
      <Modal.Actions>
        <Button data-testid={CANCEL_DATA_TEST_ID} onClick={onClose}>
          {t('global.cancel')}
        </Button>
        <Button
          primary
          data-testid={CONFIRM_DATA_TEST_ID}
          loading={isFetchingBalance}
          disabled={!selectedToken || !canBuyItem || !route} // TODO: OR INSUFFIENT BALANCE
          onClick={onBuy} // TODO
        >
          {!!selectedToken &&
          !!providerTokens.find(t => t.address === selectedToken.address)
            ? t('buy_with_crypto.buy_with_token', {
                token: providerTokens.find(
                  t => t.address === selectedToken.address
                )?.symbol
              })
            : t('buy_with_crypto.select_a_token')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(BuyWithCryptoModal)
