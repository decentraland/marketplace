import { AssetType } from '../../modules/asset/types'
import { AssetImage } from '../AssetImage'
import { AssetProvider } from '../AssetProvider'
import { Navbar } from '../Navbar'
import { Props } from './SuccessPage.types'

import styles from './SuccessPage.module.css'
import { Footer } from '../Footer'
import { locations } from '../../modules/routing/locations'
import { Button, Loader } from 'decentraland-ui'

export function SuccessPage(props: Props) {
  const { isLoading, onNavigate } = props
  const contractAddress = '0xb726634ed82ac04e6bca66b3b97cc41a2c10ec31'
  const tokenId = '0'
  return (
    <div className={styles.pageContainer}>
      <Navbar isFullscreen />
      <div className={styles.container}>
        <AssetProvider
          type={AssetType.ITEM}
          contractAddress={contractAddress}
          tokenId={tokenId}
        >
          {asset => {
            console.log({ asset })
            if (!asset) {
              return <Loader size="massive" active />
            }

            if (isLoading) {
              return (
                <>
                  <div>Your item is on its way</div>
                  <AssetImage
                    asset={asset}
                    isSmall
                    className={styles.assetImage}
                  />
                  <div><Loader size="small" inline />Processing transaction</div>
                  <span>This transaction may take a few moments.</span>
                  <Button onClick={() => onNavigate(locations.activity())}>
                    View Progress in activity
                  </Button>
                </>
              )
            }

            return (
              <>
                <div>All done</div>
                <AssetImage
                  asset={asset}
                  isSmall
                  className={styles.assetImage}
                />
                <span>Transaction confirmed</span>
                <span>This transaction may take a few moments.</span>
                <div>
                  <Button onClick={() => onNavigate(locations.activity())}>
                    View my item
                  </Button>
                  <Button onClick={() => onNavigate(locations.activity())}>
                    Try it in Genesis city
                  </Button>
                </div>
              </>
            )
          }}
        </AssetProvider>
      </div>
      <Footer />
    </div>
  )
}
