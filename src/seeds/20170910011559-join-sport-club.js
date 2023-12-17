module.exports = {
  up(queryInterface) {
    const joinData = []
    joinData.push({
      clubId: 1,
      sportId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    joinData.push({
      clubId: 2,
      sportId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    joinData.push({
      clubId: 1,
      sportId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    joinData.push({
      clubId: 2,
      sportId: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    joinData.push({
      clubId: 1,
      sportId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return queryInterface.bulkInsert('club_sports', joinData)
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('club_sports', null, {})
  },
}
