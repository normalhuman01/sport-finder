import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddSportForm from './Clubsport/AddSportForm'
import SportRow from './Clubsport/SportRow'

function priceDisplay(price) {
  if (price) {
    return '$' + price
  }
  return 'No definido'
}

export default class ClubSportsTable extends Component {
  constructor(props) {
    super(props)
    this.getSport = this.getSport.bind(this)
  }

  getSport(sportid) {
    const sport = this.props.sports.filter(elem => elem.id == sportid)
    return sport[0]
  }

  render() {
    const isAdmin = this.props.isAdmin === 'true'
    const rows = this.props.clubSports.map((tuple, i) => (
      <SportRow
        key={i}
        onSubmitDelete={this.props.onSubmitDelete}
        sport={this.getSport(tuple.sportId)}
        price={priceDisplay(tuple.price)}
        timeunit={tuple.timeUnit}
        isAdmin={isAdmin}
      />
    ))
    return (
      <div>
        <table className="index">
          <tbody>
            <tr>
              <th>Deporte</th>
              <th>Precio</th>
              <th>Unidad de tiempo</th>
            </tr>
            {rows}
          </tbody>
        </table>
        {isAdmin && (
          <AddSportForm
            onSubmit={this.props.onSubmit}
            sports={this.props.sports}
          />
        )}
      </div>
    )
  }
}
