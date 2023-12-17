module.exports = {
  up(queryInterface) {
    const joinData = []
    joinData.push({
      userId: 1,
      teamId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    joinData.push({
      userId: 2,
      teamId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    joinData.push({
      userId: 3,
      teamId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return queryInterface.bulkInsert('userTeams', joinData)
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('userTeams', null, {})
  },
}
