module.exports = function definesports(sequelize, DataTypes) {
  const clubSport = sequelize.define('clubSport', {
    price: {
      type: DataTypes.INTEGER,
    },
    timeUnit: {
      type: DataTypes.STRING,
    },
  })

  clubSport.prototype.priceDisplay = function priceDisplay() {
    if (this.price) {
      return `$${this.price}`
    }
    return 'No definido'
  }

  clubSport.associate = function associate(models) {
    clubSport.belongsTo(models.club)
    clubSport.belongsTo(models.sport)
  }
  return clubSport
}
