import { useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import type { ChainData, Token } from 'decentraland-transactions/crossChain'
import { Close, Icon, Loader } from 'decentraland-ui'
import { marketplaceAPI } from '../../../../modules/vendor/decentraland/marketplace/api'
import { Balance } from '../../../../modules/vendor/decentraland/marketplace/types'
import styles from './ChainAndTokenSelector.module.css'

export const CHAIN_AND_TOKEN_SELECTOR_DATA_TEST_ID = 'chain-and-token-selector'

type Props = {
  wallet: Wallet
  currentChain: ChainId
  chains?: ChainData[]
  tokens?: Token[]
  onSelect: (chain: ChainData | Token) => void
}

const ChainAndTokenSelector = (props: Props) => {
  const [search, setSearch] = useState('')
  const { currentChain, chains, tokens, onSelect, wallet } = props
  const title = useMemo(
    () =>
      t(`buy_with_crypto_modal.token_and_chain_selector.available_${chains ? 'chains' : 'tokens'}`, {
        chain: (
          <>
            {' '}
            <b> {getNetwork(currentChain)}</b>
          </>
        )
      }),
    [chains, currentChain]
  )

  const filteredChains = useMemo(() => {
    return chains?.filter(chain => chain.networkName.toLowerCase().includes(search.toLowerCase()))
  }, [chains, search])

  const [balances, setBalances] = useState<Record<string, Balance>>({})
  const [isFetchingBalances, setIsFetchingBalances] = useState(true)

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const balances = await marketplaceAPI.fetchWalletTokenBalances(currentChain, wallet.address)
        setIsFetchingBalances(false)
        setBalances(
          balances.reduce(
            (acc, balance) => {
              acc[balance.contract_ticker_symbol] = balance
              return acc
            },
            {} as Record<string, Balance>
          )
        )
      } catch (error) {
        setIsFetchingBalances(false)
      }
    }
    void fetchBalances()
  }, [currentChain, wallet.address])

  const filteredTokens = useMemo(() => {
    const filtered = tokens?.filter(
      token => token.symbol.toLowerCase().includes(search.toLowerCase()) && token.chainId === currentChain.toString()
    )
    // this sortes the tokens by USD balance
    filtered?.sort((a, b) => {
      const aQuote = balances[a.symbol]?.quote ?? '0'
      const bQuote = balances[b.symbol]?.quote ?? '0'
      if (aQuote === bQuote) return 0
      return aQuote < bQuote ? 1 : -1
    })
    return filtered
  }, [tokens, search, currentChain, balances])

  return (
    <div className={styles.chainAndTokenSelector} data-testid={CHAIN_AND_TOKEN_SELECTOR_DATA_TEST_ID}>
      <div className={styles.searchContainer}>
        <Icon name="search" className={styles.searchIcon} />
        <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder={t('global.search')} />
        {search ? <Close onClick={() => setSearch('')} /> : null}
      </div>
      <span className={styles.title}>{title}</span>
      {isFetchingBalances ? (
        <Loader active size="medium" />
      ) : (
        <div className={styles.listContainer}>
          {filteredChains?.map(chain => (
            <div key={chain.chainId} className={styles.rowItem} onClick={() => onSelect(chain)}>
              <img src={chain.nativeCurrency.icon} alt={chain.networkName} />
              <span>{chain.networkName}</span>
            </div>
          ))}
          {filteredTokens?.map(token => {
            return (
              <div key={`${token.symbol}-${token.address}`} className={styles.rowItem} onClick={() => onSelect(token)}>
                <div className={styles.tokenDataContainer}>
                  <img src={token.logoURI} alt={token.symbol} />
                  <div className={styles.tokenNameAndSymbolContainer}>
                    <span>{token.symbol}</span>
                    <span className={styles.tokenName}>{token.name}</span>
                  </div>
                </div>
                <span className={styles.balance}>
                  {balances[token.symbol] ? (
                    <>
                      {Number(
                        ethers.utils.formatUnits(balances[token.symbol].balance as string, balances[token.symbol].contract_decimals)
                      ).toFixed(5)}{' '}
                      {balances[token.symbol].quote ? (
                        <span className={styles.tokenName}>${balances[token.symbol].quote.toLocaleString()}</span>
                      ) : null}
                    </>
                  ) : (
                    0
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {!!search && !filteredChains?.length && !filteredTokens?.length ? (
        <span className={styles.noResults}>
          {t('buy_with_crypto_modal.token_and_chain_selector.no_matches', {
            search
          })}
        </span>
      ) : null}
    </div>
  )
}

export default ChainAndTokenSelector
