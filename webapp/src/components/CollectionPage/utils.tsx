import { Item, NFTCategory, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Dropdown, Mana } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import { getBuilderCollectionDetailUrl } from '../../modules/collection/utils'
import AssetCell from '../OnSaleOrRentList/AssetCell'
import { DataTableType } from '../Table/TableContent/TableContent.types'
import styles from './CollectionPage.module.css'

export const formatDataToTable = (rentals?: Item[], isCollectionOwner: boolean = false, isMobile = false): DataTableType[] => {
  const builderCollectionUrl = (contractAddress: string) => getBuilderCollectionDetailUrl(contractAddress)

  const getItemCategoryText = (item: Item) => {
    switch (item.category) {
      case NFTCategory.EMOTE:
      case NFTCategory.WEARABLE:
        return t(`${item.category}.category.${item.data[item.category]?.category}`)
      default:
        return t(`global.${item.category}`)
    }
  }

  return rentals
    ? rentals?.map((item: Item) => {
        const value: DataTableType = {
          [t('global.item')]: <AssetCell asset={item} />,

          ...(!isMobile && {
            [t('global.category')]: getItemCategoryText(item)
          }),

          ...(!isMobile && {
            [t('global.rarity')]: t(`rarity.${item.rarity}`)
          }),

          ...(!isMobile && {
            [t('global.stock')]: (
              <>
                {' '}
                {item.available.toLocaleString()}/{Rarity.getMaxSupply(item.rarity).toLocaleString()}
              </>
            )
          }),

          [t('global.price')]: (
            <Mana network={item.network} inline>
              {formatWeiMANA(item.price)}
            </Mana>
          )
        }

        if (isCollectionOwner) {
          value[''] = (
            <div className={styles.ellipsis}>
              <Dropdown className={styles.ellipsis} icon="ellipsis horizontal" direction="left">
                <Dropdown.Menu>
                  <Dropdown.Item text={t('collection_page.edit_price')} as="a" href={builderCollectionUrl} />
                  <Dropdown.Item text={t('collection_page.mint_item')} as="a" href={builderCollectionUrl} />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )
        }

        return value
      })
    : []
}
