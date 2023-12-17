module.exports = {
  up(queryInterface) {
    return queryInterface.addConstraint('clubSports', ['clubId', 'sportId'], {
      type: 'unique',
      name: 'clubSportConstraint',
    })
  },

  down(queryInterface) {
    return queryInterface.removeConstraint('clubSports', 'clubSportConstraint')
  },
}
