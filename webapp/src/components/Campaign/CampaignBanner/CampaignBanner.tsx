import React from "react"
import { Container } from "decentraland-ui"
import './CampaignBanner.css'

const CampaignBanner: React.FC = (props) => {
  return <Container className="CampaignBanner">{props.children}</Container>
}

export default CampaignBanner