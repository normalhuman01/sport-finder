const faker = require('faker')

module.exports = {
  up(queryInterface) {
    const teamsData = []
    for (let i = 0; i < 3; i += 1) {
      teamsData.push({
        name: faker.name.findName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('teams', teamsData)
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('teams', null, {})
  },
}
