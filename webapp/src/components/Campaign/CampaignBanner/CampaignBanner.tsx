import React from "react"
import './CampaignBanner.css'

const CampaignBanner: React.FC = (props) => {
  return <div className="CampaignBanner">{props.children}</div>
}

export default CampaignBanner
