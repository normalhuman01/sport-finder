module.exports = function definesports(sequelize, DataTypes) {
  const userTeam = sequelize.define('userTeam', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'memberConstraint',
      validate: {
        notEmpty: true,
      },
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'memberConstraint',
      validate: {
        notEmpty: true,
      },
    },
    captain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  })
  userTeam.associate = function associate(models) {
    userTeam.belongsTo(models.users)
    userTeam.belongsTo(models.team)
  }
  return userTeam
}
