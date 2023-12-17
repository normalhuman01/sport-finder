module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('matches', 'requireId', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },
  down(queryInterface) {
    return queryInterface.removeColumn('matches', 'requireId')
  },
}
