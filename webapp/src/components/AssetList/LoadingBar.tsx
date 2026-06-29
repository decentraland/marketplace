import React from 'react'
import './LoadingBar.css'

// Footer "loading more" indicator: four segments where a purple highlight
// sweeps left → right while the next page loads.
const LoadingBar = () => (
  <div className="LoadingBar" role="status" aria-label="loading">
    <span />
    <span />
    <span />
    <span />
  </div>
)

export default React.memo(LoadingBar)
