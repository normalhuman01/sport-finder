module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('matches', 'sentEvaluations', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },
  down(queryInterface) {
    return queryInterface.removeColumn('matches', 'sentEvaluations')
  },
}
