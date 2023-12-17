module.exports = function definesports(sequelize, DataTypes) {
  const sports = sequelize.define('sport', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Has ingresado un nombre vacío.' },
      },
    },
    maxPlayers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Debes ingresar un número de jugadores' },
      },
    },
  })
  sports.associate = function associate(models) {
    sports.hasMany(models.clubSport)
    sports.hasMany(models.match)
    sports.hasMany(models.team)
    sports.hasMany(models.position)
  }
  return sports
}
