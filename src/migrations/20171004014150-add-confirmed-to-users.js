module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'confirmed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },
  down(queryInterface) {
    return queryInterface.removeColumn('users', 'confirmed')
  },
}
