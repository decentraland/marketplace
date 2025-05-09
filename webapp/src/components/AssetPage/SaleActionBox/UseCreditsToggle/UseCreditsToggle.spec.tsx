import { fireEvent, screen } from '@testing-library/react'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Switch } from 'decentraland-ui2'
import CreditsIcon from '../../../../images/icon-credits.svg'
import { Asset } from '../../../../modules/asset/types'
import { renderWithProviders } from '../../../../utils/test'
import UseCreditsToggle from './UseCreditsToggle'
import { Props } from './UseCreditsToggle.types'

// Mock the Switch component
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('decentraland-ui2', () => ({
  ...jest.requireActual('decentraland-ui2'),
  Switch: jest.fn(({ onChange }: { onChange: () => void }) => (
    <div data-testid="switch-mock" onClick={() => onChange && onChange()} />
  )) as jest.Mock
}))

function renderUseCreditsToggle(props: Partial<Props> = {}) {
  return renderWithProviders(
    <UseCreditsToggle
      asset={{} as Asset}
      assetPrice="1000000000000000000" // 1 MANA
      useCredits={false}
      onUseCredits={jest.fn()}
      {...props}
    />
  )
}

describe('UseCreditsToggle', () => {
  let props: Partial<Props>
  let mockedCredits: CreditsResponse
  const onUseCredits = jest.fn()
  const mockAsset = { id: 'mock-asset-id' } as Asset

  beforeEach(() => {
    mockedCredits = {
      credits: [],
      totalCredits: 2000000000000000000 // 2 MANA in wei (as string or number depending on how the component handles it)
    }
    props = {
      asset: mockAsset,
      assetPrice: '1000000000000000000', // 1 MANA in wei
      isOwner: false,
      useCredits: false,
      onUseCredits,
      credits: mockedCredits
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when the component renders', () => {
    it('should display the "Use Credits" text', () => {
      renderUseCreditsToggle(props)
      expect(screen.getByText(t('asset_page.actions.use_credits'))).toBeInTheDocument()
    })

    it('should display the credits amount converted to MANA', () => {
      renderUseCreditsToggle(props)
      // The component should show the smaller value between asset price and total credits
      // In this case, asset price is 1 MANA and total credits is 2 MANA, so it should show 1 MANA
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should render the Switch component with the useCredits value', () => {
      renderUseCreditsToggle(props)
      expect(Switch).toHaveBeenCalledWith(
        expect.objectContaining({
          checked: props.useCredits
        }),
        expect.anything()
      )
    })
  })

  describe('when the user toggles the switch', () => {
    it('should call onUseCredits with the opposite value', () => {
      renderUseCreditsToggle({
        ...props,
        onUseCredits
      })
      const switchEl = screen.getByTestId('switch-mock')
      fireEvent.click(switchEl)
      expect(onUseCredits).toHaveBeenCalledWith(true)
    })
  })

  describe('when the user is the owner', () => {
    it('should not render the component if there are no credits', () => {
      const { container } = renderUseCreditsToggle({
        ...props,
        isOwner: true,
        credits: undefined
      })
      expect(container.firstChild).toBeNull()
    })
  })

  describe('when credits are not available', () => {
    it('should render a learn more button', () => {
      renderUseCreditsToggle({
        ...props,
        credits: undefined
      })
      expect(screen.getByText(t('global.learn_more'))).toBeInTheDocument()
    })

    it('should render the credits icon', () => {
      renderUseCreditsToggle({
        ...props,
        credits: undefined
      })
      const img = screen.getByAltText('Credits')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', CreditsIcon)
    })

    it('should render the "Get with Credits" text', () => {
      renderUseCreditsToggle({
        ...props,
        credits: undefined
      })
      expect(screen.getByText(t('asset_page.actions.get_with_credits'))).toBeInTheDocument()
    })

    it('should open documentation when learn more is clicked', () => {
      window.open = jest.fn()
      renderUseCreditsToggle({
        ...props,
        credits: undefined
      })
      const learnMoreButton = screen.getByText(t('global.learn_more'))
      fireEvent.click(learnMoreButton)
      expect(window.open).toHaveBeenCalledWith(
        'https://decentraland.org/blog/announcements/marketplace-credits-earn-weekly-rewards-to-power-up-your-look?utm_org=dcl&utm_source=marketplace&utm_medium=organic&utm_campaign=marketplacecredits',
        '_blank',
        'noopener noreferrer'
      )
    })
  })

  describe('when the asset price is greater than the available credits', () => {
    it('should display the maximum amount of credits that can be used', () => {
      renderUseCreditsToggle({
        ...props,
        credits: {
          ...mockedCredits,
          totalCredits: 500000000000000000 // 0.5 MANA in wei
        }
      })
      // The component should show the smaller value between asset price and total credits
      // In this case, asset price is 1 MANA and total credits is 0.5 MANA, so it should show 0.5 MANA
      expect(screen.getByText('0.5')).toBeInTheDocument()
    })
  })

  describe('when the component is in active state', () => {
    it('should apply the active class when useCredits is true', () => {
      const { container } = renderUseCreditsToggle({
        ...props,
        useCredits: true
      })
      const creditsContainer = container.firstChild
      expect(creditsContainer).toHaveClass('creditsContainerActive')
    })
  })
})
