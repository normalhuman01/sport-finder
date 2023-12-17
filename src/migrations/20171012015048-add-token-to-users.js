module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'token', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },
  down(queryInterface) {
    return queryInterface.removeColumn('users', 'token')
  },
}
