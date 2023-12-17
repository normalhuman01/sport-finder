module.exports = function defineposition(sequelize, DataTypes) {
  const position = sequelize.define(
    'position',
    {
      name: {
        type: DataTypes.STRING,
        defaultValue: 'Sin definir',
        allowNull: false,
      },
      horizontalAlignment: {
        type: DataTypes.STRING,
      },
      verticalAlignment: {
        type: DataTypes.STRING,
      },
    },
    {
      validate: {
        bothAlignementsOrNone() {
          if (
            (this.horizontalAlignment === null) !==
            (this.verticalAlignment === null)
          ) {
            throw new Error('Se necesitan o ambos alineamientos o ninguno.')
          }
        },
      },
    }
  )
  position.associate = function associate(models) {
    position.belongsTo(models.sport)
  }
  return position
}
