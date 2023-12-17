module.exports = {
  up(queryInterface) {
    return queryInterface.removeColumn('matches', 'sportId')
  },

  down(queryInterface, Sequelize) {
    return queryInterface.addColumn('matches', 'sportId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'sports',
        key: 'id',
      },
      onDelete: 'cascade',
    })
  },
}
