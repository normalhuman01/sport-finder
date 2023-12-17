module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'apiUsername', {
      type: Sequelize.STRING,
    })
  },
  down(queryInterface) {
    return queryInterface.removeColumn('users', 'apiUsername')
  },
}
