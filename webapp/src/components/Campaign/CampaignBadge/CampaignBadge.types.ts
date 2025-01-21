export type Props = {
  isCampaignBrowserEnabled: boolean
  campaignTag?: string
  contract: string
}

export type MapStateProps = Pick<Props, 'isCampaignBrowserEnabled' | 'campaignTag'>
