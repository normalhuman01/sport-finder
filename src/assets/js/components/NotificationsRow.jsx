import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class NotificationRow extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onSubmitDelete = this.onSubmitDelete.bind(this)
  }

  onSubmit(e) {
    this.props.onSubmit(this.props.notification.acceptUrl)
    e.preventDefault()
  }

  onSubmitDelete(e) {
    this.props.onSubmitDelete(this.props.notification.declineUrl)
    e.preventDefault()
  }

  render() {
    console.log(this.props.notification)
    const iframeStyle = { display: 'none' }
    return (
      <div className="notification">
        <a className="show-url" href={this.props.notification.showUrl}>
          {this.props.notification.message}
        </a>
        <div className="hide-overflow">
          <form onSubmit={this.onSubmit}>
            <input type="hidden" name="name" />
            <input className="right" type="submit" value="Unirse" />
          </form>
          <form onSubmit={this.onSubmitDelete} target="background-submit">
            <input className="left" type="submit" value="Rechazar" />
          </form>
          <iframe style={iframeStyle} name="background-submit" />
        </div>
      </div>
    )
  }
}
