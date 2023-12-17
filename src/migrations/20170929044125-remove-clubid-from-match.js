module.exports = {
  up(queryInterface) {
    return queryInterface.removeColumn('matches', 'clubId')
  },

  down(queryInterface, Sequelize) {
    return queryInterface.addColumn('matches', 'clubId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'clubs',
        key: 'id',
      },
      onDelete: 'cascade',
    })
  },
}
