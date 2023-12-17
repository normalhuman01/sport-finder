module.exports = function defineuserMatch(sequelize, DataTypes) {
  const userMatch = sequelize.define('userMatch', {
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  })
  userMatch.prototype.isAdmin = function isAdmin() {
    return this.admin === true
  }
  userMatch.associate = function associate(models) {
    userMatch.belongsTo(models.users)
    userMatch.belongsTo(models.match)
    userMatch.belongsTo(models.position)
  }
  return userMatch
}
