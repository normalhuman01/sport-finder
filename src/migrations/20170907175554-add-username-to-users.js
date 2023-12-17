module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    })
  },
  down(queryInterface) {
    return queryInterface.removeColumn('users', 'username')
  },
}
