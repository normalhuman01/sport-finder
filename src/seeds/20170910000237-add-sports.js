module.exports = {
  up(queryInterface) {
    const sportsData = []
    const sportsNames = ['Futbol', 'Basquetbol', 'Tenis', 'Natacion', 'Polo']
    for (let i = 0; i < 5; i += 1) {
      sportsData.push({
        name: sportsNames[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('sports', sportsData)
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('sports', null, {})
  },
}
