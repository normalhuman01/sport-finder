import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NotificationRow from './NotificationsRow'
import NotificationsService from '../services/requester'

export default class Notifications extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notifications: [],
      currentUser: '',
      loading: true,
      error: undefined,
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onSubmitDelete = this.onSubmitDelete.bind(this)
  }

  componentDidMount() {
    console.log('Fetching notifications')
    this.fetchNotifications()
  }

  async onSubmit(acceptUrl) {
    this.setState({ loading: true, success: undefined })
    try {
      const json = await NotificationsService.acceptNotification(acceptUrl, {
        name: this.state.currentUser.username,
      })
      await this.fetchNotifications()
      this.setState({ error: '', success: json.success })
    } catch (error) {
      this.setState({ loading: false, error: error.message, success: false })
    }
  }

  async onSubmitDelete(declineUrl) {
    try {
      await NotificationsService.declineNotification(declineUrl)
      await this.fetchNotifications()
      this.setState({ error: '', success: true })
    } catch (error) {
      this.setState({ error: error.message, loading: false, success: false })
    }
  }

  async fetchNotifications() {
    const json = await NotificationsService.getNotifications()
    this.setState({
      notifications: json.notifications,
      currentUser: json.user,
      loading: false,
    })
    console.log(this.state.notifications)
  }

  render() {
    const hasNots = this.state.notifications.length != 0
    const notifRows = this.state.notifications.map((elem, i) => (
      <NotificationRow
        key={i}
        notification={elem}
        onSubmit={this.onSubmit}
        onSubmitDelete={this.onSubmitDelete}
      />
    ))
    if (this.state.loading) {
      return <div> Cargando notificaciones </div>
    }
    return (
      <div className="dropdown-content" id="myDropdown">
        <div>
          {' '}
          <a id="profile" href="/profile">
            Mi Perfil
          </a>
        </div>
        {hasNots && <div>{notifRows}</div>}
      </div>
    )
  }
}
