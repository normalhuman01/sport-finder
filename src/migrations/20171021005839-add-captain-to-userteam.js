module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('userTeams', 'captain', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },
  down(queryInterface) {
    return queryInterface.removeColumn('userTeams', 'captain')
  },
}
