import { screen } from '@testing-library/react'
import { ChainId } from '@dcl/schemas'
import { STOLEN_NFT_KEYS } from '../../lib/stolenNfts'
import { Asset } from '../../modules/asset/types'
import { renderWithProviders } from '../../utils/test'
import StolenNFTWarning from './StolenNFTWarning'

const [chainId, contractAddress, tokenId] = STOLEN_NFT_KEYS[0].split(':')

describe('StolenNFTWarning', () => {
  describe('when the NFT was reported as stolen', () => {
    it('should render the stolen label as an alert', () => {
      renderWithProviders(<StolenNFTWarning asset={{ chainId: Number(chainId), contractAddress, tokenId } as Asset} />)
      const warning = screen.getByTestId('stolen-nft-warning')
      expect(warning).toHaveAttribute('role', 'alert')
      expect(warning).toHaveTextContent("STOLEN NFTS CAN'T BE BOUGHT")
    })
  })

  describe('when the NFT was not reported as stolen', () => {
    it('should render nothing', () => {
      renderWithProviders(<StolenNFTWarning asset={{ chainId: ChainId.ETHEREUM_MAINNET, contractAddress, tokenId: '0' } as Asset} />)
      expect(screen.queryByTestId('stolen-nft-warning')).not.toBeInTheDocument()
    })
  })

  describe('when there is no asset', () => {
    it('should render nothing', () => {
      renderWithProviders(<StolenNFTWarning asset={null} />)
      expect(screen.queryByTestId('stolen-nft-warning')).not.toBeInTheDocument()
    })
  })
})
