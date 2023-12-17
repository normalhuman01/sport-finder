module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('sports', 'maxPlayers', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('sports', 'maxPlayers')
  },
}
