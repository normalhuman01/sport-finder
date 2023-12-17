module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('userMatches', 'positionId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'positions',
        key: 'id',
      },
      onDelete: 'set null',
    })
  },
  down(queryInterface) {
    return queryInterface.removeColumn('userMatches', 'positionId')
  },
}
