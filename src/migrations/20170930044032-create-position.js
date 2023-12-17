module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('positions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'No definida',
      },
      sportId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sports',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      horizontalAlignment: {
        type: Sequelize.STRING,
      },
      verticalAlignment: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down(queryInterface) {
    return queryInterface.dropTable('positions')
  },
}
