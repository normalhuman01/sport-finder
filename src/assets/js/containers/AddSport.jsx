import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ClubSportsTable from '../components/ClubSportsTable'
import SportsService from '../services/requester'

export default class AddSport extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: true, success: true, error: undefined }
    this.onSubmit = this.onSubmit.bind(this)
    this.onSubmitDelete = this.onSubmitDelete.bind(this)
  }

  componentDidMount() {
    console.log('Fetching')
    this.fetchSports()
  }

  async onSubmit(data) {
    this.setState({ loading: true, success: undefined })
    try {
      const json = await SportsService.putSport(this.props.clubId, data)
      if (json.sport) {
        this.state.clubSports.push(json.clubSport)
      }
      this.setState({
        loading: false,
        success: json.success,
        error: json.error,
      })
    } catch (error) {
      this.setState({ error: error.message, loading: false, success: false })
    }
  }

  async onSubmitDelete(data) {
    this.setState({ loading: true, success: undefined })
    try {
      await SportsService.deleteSport(this.props.clubId, data.sportId)
      await this.fetchSports()
      this.setState({ success: true })
    } catch (error) {
      this.setState({ error: error.message, loading: false, success: false })
    }
  }

  async fetchSports() {
    const json = await SportsService.getSports(this.props.clubId)
    this.setState({
      sports: json.sports,
      clubSports: json.clubSports,
      loading: false,
    })
  }

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>
    }
    return (
      <div>
        {!this.state.success && <div> {this.state.error} </div>}
        <ClubSportsTable
          onSubmit={this.onSubmit}
          onSubmitDelete={this.onSubmitDelete}
          sports={this.state.sports}
          clubSports={this.state.clubSports}
          isAdmin={this.props.isAdmin}
        />
      </div>
    )
  }
}
