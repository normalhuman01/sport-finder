const parseDate = require('../helpers/parseDate')

module.exports = function definematch(sequelize, DataTypes) {
  const match = sequelize.define(
    'match',
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Debes ingresar la fecha.' },
          isRealistic(value) {
            if (
              value &&
              value.getTime() < new Date(Date.now() + 5 * 3600 * 1000).getTime()
            ) {
              throw new Error('La fecha a lo menos en 5 horas más.')
            } else if (
              value &&
              value.getTime() >
                new Date(Date.now() + 365 * 24 * 3600 * 1000).getTime()
            ) {
              throw new Error('La fecha no puede exceder de un año.')
            }
          },
        },
      },
      requireId: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      sentEvaluations: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      private: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      getterMethods: {
        displayDate() {
          return parseDate(this.date)
        },
      },
    }
  )
  match.prototype.isPlayer = function isPlayer(userId) {
    let belongs = false
    if (this.userMatches.length) {
      this.userMatches.forEach(player => {
        if (player.user.id === userId) {
          belongs = true
        }
      })
    }
    return belongs
  }
  match.prototype.adminsCount = function adminsCount() {
    function getAdmins(player) {
      return player.dataValues.admin === true
    }
    return this.userMatches.filter(getAdmins).length
  }
  match.prototype.playersCount = function playersCount() {
    return this.userMatches.length
  }
  match.prototype.maxPlayers = function maxPlayers() {
    if (this.sport) {
      return this.sport.maxPlayers
    }
    return ' - '
  }
  match.prototype.isFull = function isFull() {
    if (this.sport) {
      return this.userMatches.length === this.sport.maxPlayers
    }
    return false
  }

  match.prototype.isOver = function isOver() {
    const today = new Date()
    const thisDate = new Date(this.date)
    const diffInMinutes = (today - thisDate) / (1000 * 60)
    if (diffInMinutes >= 5) {
      return true
    } else {
      return false
    }
  }

  match.prototype.canJoin = function canJoin(user) {
    if (!user.photoId && this.requireId) {
      return { success: false, reason: 'requireId' }
    }
    // if (this.private && notInvited) {
    //   return { success: false, reason: 'private' }
    // }
    return { success: true }
  }

  match.associate = function associate(models) {
    match.belongsTo(models.club)
    match.belongsTo(models.sport)
    match.hasMany(models.userMatch)
  }
  return match
}
