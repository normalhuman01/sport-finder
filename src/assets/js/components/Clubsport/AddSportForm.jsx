import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class AddSportForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sportId: this.props.sports[0].id, // defaul select option
      price: '', // default price
      timeUnit: '', // default time unit
      success: true,
      error: undefined,
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    if (this.state.price && this.state.timeUnit) {
      this.setState({ success: true })
      this.props.onSubmit({
        sportId: this.state.sportId,
        price: this.state.price,
        timeUnit: this.state.timeUnit,
      })
    } else {
      this.setState({
        error: 'Debes completar todos los campos',
        success: false,
      })
    }
  }

  render() {
    const sportsTags = this.props.sports.map((sport, i) => (
      <option key={i} value={sport.id}>
        {' '}
        {sport.name}{' '}
      </option>
    ))
    return (
      <div>
        {!this.state.success && <div> {this.state.error} </div>}
        <form onSubmit={this.onSubmit}>
          <select name="sportId" onChange={this.onInputChange}>
            {sportsTags}
          </select>
          <div className="inline">
            <input
              type="text"
              name="price"
              placeholder="Precio"
              onChange={this.onInputChange}
            />
          </div>
          <div className="inline">
            <input
              type="text"
              name="timeUnit"
              placeholder="Unidad de tiempo"
              onChange={this.onInputChange}
            />
          </div>
          <div className="inline">
            <input type="submit" name="add" value="Agregar Deporte" />
          </div>
        </form>
      </div>
    )
  }
}
