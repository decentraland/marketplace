import { useMemo, useState } from 'react'
import { ChainId } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { Close, Icon } from 'decentraland-ui'
import {
  ChainData,
  Token
} from 'decentraland-transactions/dist/crossChain/types'
import styles from './ChainAndTokenSelector.module.css'

export const CHAIN_AND_TOKEN_SELECTOR_DATA_TEST_ID = 'chain-and-token-selector'

type Props = {
  currentChain: ChainId
  chains?: ChainData[]
  tokens?: Token[]
  onSelect: (chain: ChainData | Token) => void
}

const ChainAndTokenSelector = (props: Props) => {
  const [search, setSearch] = useState('')
  const { currentChain, chains, tokens, onSelect } = props
  const title = useMemo(
    () =>
      t(
        `buy_with_crypto_modal.token_and_chain_selector.available_${
          !!chains ? 'chains' : 'tokens'
        }`,
        {
          chain: (
            <>
              {' '}
              <b> {getNetwork(currentChain)}</b>
            </>
          )
        }
      ),
    [chains, currentChain]
  )

  const filteredChains = useMemo(() => {
    return chains?.filter(chain =>
      chain.networkName.toLowerCase().includes(search.toLowerCase())
    )
  }, [chains, search])

  const filteredTokens = useMemo(() => {
    return tokens?.filter(
      token =>
        token.symbol.toLowerCase().includes(search.toLowerCase()) &&
        token.chainId === currentChain.toString()
    )
  }, [tokens, search, currentChain])

  return (
    <div
      className={styles.chainAndTokenSelector}
      data-testid={CHAIN_AND_TOKEN_SELECTOR_DATA_TEST_ID}
    >
      <div className={styles.searchContainer}>
        <Icon name="search" className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('global.search')}
        />
        {search ? <Close onClick={() => setSearch('')} /> : null}
      </div>
      <span className={styles.title}>{title}</span>
      <div className={styles.listContainer}>
        {filteredChains?.map(chain => (
          <div
            key={chain.chainId}
            className={styles.rowItem}
            onClick={() => onSelect(chain)}
          >
            <img src={chain.nativeCurrency.icon} alt={chain.networkName} />
            <span>{chain.networkName}</span>
          </div>
        ))}
        {filteredTokens?.map(token => (
          <div
            key={`${token.symbol}-${token.address}`}
            className={styles.rowItem}
            onClick={() => onSelect(token)}
          >
            <img src={token.logoURI} alt={token.symbol} />
            <span>{token.symbol}</span>
          </div>
        ))}
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
