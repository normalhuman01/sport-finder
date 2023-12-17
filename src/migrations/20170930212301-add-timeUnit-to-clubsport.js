module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('clubSports', 'timeUnit', {
      type: Sequelize.STRING,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('clubSports', 'timeUnit')
  },
}
