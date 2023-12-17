const bcrypt = require('bcrypt')

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, 10)
    instance.set('password', hash)
  }
}

module.exports = function defineusers(sequelize, DataTypes) {
  const users = sequelize.define('users', {
    pid: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^(\d{1,3}(\.?\d{3}){2})\-?([\dkK])$/,
          msg: 'El RUT ingresado no es válido',
        }, // eslint-disable-line no-useless-escape
      },
    },
    token: {
      type: DataTypes.STRING,
    },
    apiUsername: {
      type: DataTypes.STRING,
    },
    hasPendingEvaluations: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: {
          msg: 'Has ingresado un nombre de usuario con caracteres inválidos',
        },
        notEmpty: { msg: 'Has ingresado un nombre de usuario vacío' },
      },
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: { msg: 'Has ingresado un nombre con caracteres inválidos' },
        notEmpty: { msg: 'Has ingresado un nombre vacío' },
      },
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: { msg: 'Has ingresado un nombre con caracteres inválidos' },
        notEmpty: { msg: 'Has ingresado un apellido vacío' },
      },
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Has ingresado un e-mail inválido' },
        notEmpty: { msg: 'Has ingresado un e-mail vacío' },
      },
    },
    photoId: DataTypes.STRING,
    confirmed: {
      type: DataTypes.BOOLEAN,
      // allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Has ingresado una contraseña vacía' },
        len: {
          args: [6, 10],
          msg:
            'Has ingresado una contraseña con largo incorrecto (entre 6 y 10 caracteres)',
        },
      },
    },
  })
  users.beforeUpdate(buildPasswordHash)
  users.beforeCreate(buildPasswordHash)
  users.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password)
  }
  users.prototype.isAdmin = function isAdmin() {
    return this.role === 0
  }

  users.associate = function associate(models) {
    users.hasMany(models.userTeam)
    users.hasMany(models.userMatch)
  }
  return users
}
