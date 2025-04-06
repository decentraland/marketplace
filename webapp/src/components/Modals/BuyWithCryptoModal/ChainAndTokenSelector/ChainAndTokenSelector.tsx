import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { BigNumber, ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import type { ChainData, Token } from 'decentraland-transactions/crossChain'
import { Close, Icon, Loader } from 'decentraland-ui'
import { getTokenBalance } from '../utils'
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
  const mounted = useRef(false)
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

  const [balances, setBalances] = useState<Record<string, BigNumber>>({})
  const [fetchingBalances, setFetchingBalances] = useState<Record<string, boolean>>({})

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const fetchBalance = useCallback(
    async (token: Token) => {
      if (balances[token.symbol] !== undefined || fetchingBalances[token.symbol]) {
        return
      }
      setFetchingBalances(prev => ({ ...prev, [token.symbol]: true }))

      try {
        const balance = await getTokenBalance(token, currentChain, wallet.address)
        if (mounted.current) {
          setBalances(prev => ({ ...prev, [token.symbol]: balance }))
        }
      } catch (error) {
        if (mounted.current) {
          setBalances(prev => ({ ...prev, [token.symbol]: BigNumber.from(0) }))
        }
      } finally {
        if (mounted.current) {
          setFetchingBalances(prev => ({ ...prev, [token.symbol]: false }))
        }
      }
    },
    [balances, setBalances, currentChain, wallet.address]
  )

  const filteredTokens = useMemo(() => {
    const filtered = tokens?.filter(
      token => token.symbol.toLowerCase().includes(search.toLowerCase()) && token.chainId === currentChain.toString()
    )
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
      <div className={styles.listContainer}>
        {filteredChains?.map(chain => (
          <div key={chain.chainId} className={styles.rowItem} onClick={() => onSelect(chain)}>
            <img src={chain.nativeCurrency.icon} alt={chain.networkName} />
            <span>{chain.networkName}</span>
          </div>
        ))}
        {filteredTokens?.map(token => {
          return (
            <InView onChange={inView => inView && fetchBalance(token)}>
              <div key={`${token.symbol}-${token.address}`} className={styles.rowItem} onClick={() => onSelect(token)}>
                <div className={styles.tokenDataContainer}>
                  <img src={token.logoURI} alt={token.symbol} />
                  <div className={styles.tokenNameAndSymbolContainer}>
                    <span>{token.symbol}</span>
                    <span className={styles.tokenName}>{token.name}</span>
                  </div>
                </div>
                <span className={styles.balance}>
                  {fetchingBalances[token.symbol] !== false ? (
                    <Loader active inline size="small" />
                  ) : balances[token.symbol] !== undefined ? (
                    <>
                      {Number(ethers.utils.formatUnits(balances[token.symbol], token.decimals)).toFixed(5)}
                      <span className={styles.tokenName}>&#8202;</span>
                    </>
                  ) : (
                    0
                  )}
                </span>
              </div>
            </InView>
          )
        })}
      </div>

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
