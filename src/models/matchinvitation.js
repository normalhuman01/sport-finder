module.exports = function definematchInvitation(sequelize, DataTypes) {
  const matchInvitation = sequelize.define('matchInvitation', {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  })
  matchInvitation.associate = function associate(models) {
    matchInvitation.belongsTo(models.users)
    matchInvitation.belongsTo(models.match)
  }
  return matchInvitation
}
