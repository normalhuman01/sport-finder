module.exports = function defineteamInvitation(sequelize, DataTypes) {
  const teamInvitation = sequelize.define('teamInvitation', {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniqueTeamInvitation',
      validate: {
        notEmpty: true,
      },
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniqueTeamInvitation',
      validate: {
        notEmpty: true,
      },
    },
  })
  teamInvitation.associate = function associate(models) {
    teamInvitation.belongsTo(models.users)
    teamInvitation.belongsTo(models.team)
  }
  return teamInvitation
}
