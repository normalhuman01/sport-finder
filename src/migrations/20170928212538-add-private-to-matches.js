module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('matches', 'private', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },
  down(queryInterface) {
    return queryInterface.removeColumn('matches', 'private')
  },
}
