module.exports = function defineevaluation(sequelize, DataTypes) {
  const evaluation = sequelize.define('evaluation', {
    stars: { type: DataTypes.INTEGER, validate: { min: 1, max: 3 } },
    userId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
  })
  evaluation.associate = function associate(models) {
    evaluation.belongsTo(models.users)
    evaluation.belongsTo(models.userMatch, { as: 'player' })
  }
  return evaluation
}
