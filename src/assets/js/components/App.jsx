import React from 'react'
import AddSportForm from '../containers/AddSport'

export default function App(props) {
  console.log(props)
  return <AddSportForm {...props} />
}
