/* eslint-disable */

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'
import NotificationsApp from './components/NotificationsApp'

const render = function render(Component, reactAppContainer, componentName) {
  ReactDOM.render(
    <AppContainer>
      <Component {...reactAppContainer.dataset} />
    </AppContainer>,
    reactAppContainer
  )
  if (module.hot) {
    module.hot.accept(`./components/${componentName}`, () => {
      render(App, ClubSportContainer)
    })
  }
}

const ClubSportContainer = document.getElementById('react-club')
const NotificationsContainer = document.getElementById('react-notifications')

if (ClubSportContainer) {
  render(App, ClubSportContainer, 'App')
}
if (NotificationsContainer) {
  render(NotificationsApp, NotificationsContainer, 'NotificationsApp')
}
