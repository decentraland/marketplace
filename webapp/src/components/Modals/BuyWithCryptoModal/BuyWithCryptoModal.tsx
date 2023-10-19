import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Squid } from '@0xsquid/sdk'
import {
  ChainData,
  TokenData as Token,
  RouteResponse
} from '@0xsquid/sdk/dist/types'
import { ChainId } from '@dcl/schemas'
import { Button, Dropdown, ModalNavigation } from 'decentraland-ui'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './BuyWithCryptoModal.types'
import styles from './BuyWithCryptoModal.module.css'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { ethers, BigNumber } from 'ethers'
import { isNFT } from '../../../modules/asset/utils'
import { Mana } from '../../Mana'
import { formatWeiMANA } from '../../../lib/mana'
import { ContractName, getContract } from 'decentraland-transactions'
import { AxelarProvider } from '../../../lib/xchain'

export const CANCEL_DATA_TEST_ID = 'confirm-delete-list-modal-cancel'
export const CONFIRM_DATA_TEST_ID = 'confirm-delete-list-modal-confirm'

const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

const DEFAULT_TOKEN_BY_CHAIN = {
  [ChainId.MATIC_MUMBAI]: {
    chainId: 1,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg',
    coingeckoId: 'ethereum',
    commonKey: 'weth-wei'
  }
}

const DEFAULT_CHAIN = ChainId.MATIC_MUMBAI

export type ProviderChain = ChainData
export type ProviderToken = Token

const BuyWithCryptoModal = (props: Props) => {
  const {
    wallet,
    onClose,
    metadata: { asset, order }
  } = props

  const [squid, setSquid] = useState<Squid>()
  const [selectedChain, setSelectedChain] = useState(
    wallet?.chainId || ChainId.ETHEREUM_MAINNET
  )
  const [providerChains, setProviderChains] = useState<ProviderChain[]>([])
  const [providerTokens, setProviderTokens] = useState<ProviderToken[]>([])
  const [selectedToken, setSelectedToken] = useState<Token>(
    DEFAULT_TOKEN_BY_CHAIN[DEFAULT_CHAIN]
  )
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<number>()
  const [isLoading, setIsLoading] = useState({ balance: false, route: false })
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<BigNumber>()
  const [route, setRoute] = useState<RouteResponse>()
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
    })()
  }, [])

  // fetch selected token balance & price
  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setIsLoading(prevState => ({ ...prevState, balance: true }))
        if (
          squid &&
          squid.initialized &&
          selectedChain &&
          selectedToken &&
          wallet
        ) {
          const networkProvider = await getNetworkProvider(selectedChain)
          const provider = new ethers.providers.Web3Provider(networkProvider)
          const selectedTokenPrice = await squid.getTokenPrice({
            tokenAddress: selectedToken.address,
            chainId: selectedToken.chainId
          })

          if (!cancel) {
            setSelectedTokenPrice(selectedTokenPrice)
          }

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
          setIsLoading(prevState => ({ ...prevState, balance: false }))
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
        selectedTokenPrice &&
        !isNFT(asset)
      ) {
        const balance = parseFloat(
          ethers.utils.formatEther(selectedTokenBalance)
        )

        const destinyChainMANA = getContract(
          ContractName.MANAToken,
          asset.chainId
        ).address
        const manaPrice = await squid.getTokenPrice({
          tokenAddress: destinyChainMANA,
          chainId: asset.chainId
        })

        const itemPriceInUSD =
          Number(ethers.utils.formatEther(asset.price)) * manaPrice

        const balanceInUSD = balance * selectedTokenPrice
        setCanBuyItem(balanceInUSD >= itemPriceInUSD)
      }
    })()
  }, [asset, selectedTokenBalance, selectedTokenPrice, squid])

  // calculate route on selectedToken change
  useEffect(() => {
    let cancel = false
    ;(async () => {
      if (squid && squid.initialized && wallet) {
        const selectedTokenPrice = await squid.getTokenPrice({
          tokenAddress: selectedToken.address,
          chainId: selectedToken.chainId
        })

        const destinyChainMANA = getContract(
          ContractName.MANAToken,
          asset.chainId
        ).address
        const manaPrice = await squid.getTokenPrice({
          tokenAddress: destinyChainMANA,
          chainId: asset.chainId
        })

        setIsLoading(prevState => ({ ...prevState, route: true }))
        const xChainProvider = new AxelarProvider()
        let route: RouteResponse | undefined = undefined

        const fromAmount =
          (Number(
            ethers.utils.formatEther(
              order ? order.price : !isNFT(asset) ? asset.price : ''
            )
          ) *
            manaPrice) /
          selectedTokenPrice
        const fromAmountWei = ethers.utils
          .parseUnits(fromAmount.toFixed(6), selectedToken.decimals)
          .toString()

        const baseRouteConfig = {
          fromAddress: wallet.address,
          fromAmount: fromAmountWei,
          fromChain: selectedChain,
          fromToken: selectedToken.address
        }
        // there's an order so it's buying an NFT
        if (order) {
          route = await xChainProvider.getBuyNFTRoute({
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
          // buying an item
          route = await xChainProvider.getMintNFTRoute({
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

        if (!cancel) {
          if (route) {
            setRoute(route)
          }
          setIsLoading(prevState => ({ ...prevState, route: false }))
        }
      }
    })()
    return () => {
      cancel = true
    }
  }, [
    asset,
    order,
    selectedChain,
    selectedToken,
    selectedTokenBalance,
    squid,
    wallet
  ])

  return (
    <Modal size="tiny" onClose={onClose}>
      <ModalNavigation
        title={t('buy_with_crypto.title', {
          name: asset.name,
          b: (children: React.ReactChildren) => <b>{children}</b>
        })}
        onClose={onClose}
      />
      <Modal.Content>
        <div>
          {t('buy_with_crypto.subtitle', {
            name: asset.name,
            amount: (
              <Mana showTooltip network={asset.network} inline withTooltip>
                {formatWeiMANA(
                  order ? order.price : !isNFT(asset) ? asset.price : ''
                )}
              </Mana>
            )
          })}
          <div className={styles.dropdown_container}>
            <Dropdown
              className={styles.dcl_dropdown}
              value={selectedChain}
              options={providerChains.map(chain => ({
                text: chain.networkName,
                value: +chain.chainId,
                image: { avatar: true, src: chain.nativeCurrency.icon }
              }))}
              onChange={(_, data) => setSelectedChain(data.value as any)}
            />
            <Dropdown
              className={classNames(styles.dcl_dropdown, styles.token_dropdown)}
              search
              scrolling
              value={selectedToken.address}
              options={providerTokens
                .filter(token => token.chainId === selectedChain)
                .map(token => ({
                  text: token.symbol,
                  value: token.address,
                  image: { avatar: true, src: token.logoURI }
                }))}
              onChange={(_, data) =>
                setSelectedToken(
                  providerTokens.find(t => t.address === data.value) as Token
                )
              }
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
        {isLoading.route ? (
          <div>{t('buy_with_crypto.fetching_route')}</div>
        ) : null}
        {route && !isLoading.route ? (
          <div className={styles.summaryContainer}>
            <span>{t('buy_with_crypto.summary')}</span>
            <span>
              {t('buy_with_crypto.exchange_rate', {
                symbol: selectedToken.symbol,
                manaAmount: route.route.estimate.exchangeRate?.slice(0, 7)
              })}
            </span>
            <span>
              {t('buy_with_crypto.route.estimated_route_duration', {
                duration: route.route.estimate.estimatedRouteDuration
              })}
            </span>
            {route.route.estimate.gasCosts.map((gasCost, index) => (
              <span key={index}>
                {t('buy_with_crypto.route.gas_cost_in_token', {
                  cost: ethers.utils.formatEther(gasCost.amount).slice(0, 6),
                  token: gasCost.token.symbol,
                  costInUSD: gasCost.amountUSD
                })}
              </span>
            ))}
            {route.route.estimate.feeCosts.map(feeCost => (
              <span key={feeCost.name}>
                {t('buy_with_crypto.route.fee_cost', {
                  feeName: feeCost.name,
                  cost: ethers.utils.formatEther(feeCost.amount).slice(0, 6),
                  token: feeCost.token.symbol,
                  costInUSD: feeCost.amountUSD
                })}
              </span>
            ))}
          </div>
        ) : null}
        {!canBuyItem ? (
          <span className={styles.insufficientFunds}>
            {t('buy_with_crypto.insufficient_funds', {
              token: selectedToken.symbol
            })}
          </span>
        ) : null}
      </Modal.Content>
      <Modal.Actions>
        <Button data-testid={CANCEL_DATA_TEST_ID} onClick={onClose}>
          {t('global.cancel')}
        </Button>
        <Button
          primary
          data-testid={CONFIRM_DATA_TEST_ID}
          loading={isLoading.balance}
          disabled={!selectedToken || !canBuyItem || !route} // TODO: OR INSUFFIENT BALANCE
          onClick={() => {}} // TODO
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
