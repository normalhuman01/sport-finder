module.exports = {
  up(queryInterface) {
    return queryInterface.renameTable('club_sports', 'clubSports')
  },

  down(queryInterface) {
    return queryInterface.renameTable('clubSports', 'club_sports')
  },
}
