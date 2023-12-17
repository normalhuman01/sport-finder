module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('matches', 'sportId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'sports',
        key: 'id',
      },
      onDelete: 'set null',
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('matches', 'sportId')
  },
}
