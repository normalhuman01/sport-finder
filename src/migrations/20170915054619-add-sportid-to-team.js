module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('teams', 'sportId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'sports',
        key: 'id',
      },
      onDelete: 'cascade',
    })
  },

  down(queryInterface) {
    return queryInterface.removeColumn('teams', 'sportId')
  },
}
