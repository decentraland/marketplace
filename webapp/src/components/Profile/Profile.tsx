import * as React from 'react'
import { AvatarFace, Blockie, Logo, Popup } from 'decentraland-ui'
import { Props } from './Profile.types'
import './Profile.css'

export default class Profile extends React.PureComponent<Props> {
  static defaultProps = {
    inline: true
  }

  componentWillMount() {
    this.fetchProfile(this.props)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.address !== this.props.address) {
      this.fetchProfile(nextProps)
    }
  }

  fetchProfile(props: Props) {
    const { address, avatar, onLoadProfile } = props
    if (!avatar) {
      onLoadProfile(address)
    }
  }

  render() {
    const {
      address,
      avatar,
      textOnly,
      imageOnly,
      hasPopup,
      inline,
      size,
      isDecentraland
    } = this.props
    const name = (avatar && avatar.name) || address.slice(0, 6)

    if (isDecentraland) {
      return (
        <span
          className={`Profile decentraland ${size} ${inline ? 'inline' : ''}`}
          title={address}
        >
          <Logo />
          {imageOnly ? null : <span className="name">Decentraland</span>}
        </span>
      )
    }

    if (textOnly) {
      return name
    } else {
      return (
        <Popup
          content={name}
          disabled={!hasPopup}
          position="top center"
          trigger={
            avatar ? (
              <span
                className={`Profile avatar ${size} ${inline ? 'inline' : ''}`}
                title={address}
              >
                <AvatarFace size="tiny" inline={inline} avatar={avatar} />
                {imageOnly ? null : <span className="name">{name}</span>}
              </span>
            ) : (
              <span
                className={`Profile blockie ${size} ${inline ? 'inline' : ''}`}
                title={address}
              >
                <Blockie
                  seed={address}
                  scale={
                    size === 'large'
                      ? 5
                      : size === 'huge'
                      ? 7
                      : size === 'massive'
                      ? 21
                      : 3
                  }
                />
                {imageOnly ? null : <span className="name">{name}</span>}
              </span>
            )
          }
        />
      )
    }
  }
}
