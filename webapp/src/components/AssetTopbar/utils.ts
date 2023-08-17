import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { MAX_QUERY_SIZE } from '../../modules/vendor/api'

export function getCountText(count: number | undefined, search: string | undefined) {
  if (count === undefined) {
    return ''
  } else if (search) {
    return count > 0
      ? t(count < MAX_QUERY_SIZE ? 'nft_filters.query_results' : 'nft_filters.query_more_than_results', {
          count: count.toLocaleString(),
          search
        })
      : t('nft_filters.no_items')
  }
  return t(count < MAX_QUERY_SIZE ? 'nft_filters.results' : 'nft_filters.more_than_results', {
    count: count.toLocaleString()
  })
}
