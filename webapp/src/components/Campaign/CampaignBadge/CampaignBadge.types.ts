export type Props = {
  isCampaignBrowserEnabled: boolean
  contract: string
}

export type MapStateProps = Pick<Props, 'isCampaignBrowserEnabled'>
