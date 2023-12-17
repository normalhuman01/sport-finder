module.exports = {
  up(queryInterface) {
    return queryInterface.addConstraint(
      'matchInvitations',
      ['userId', 'matchId'],
      {
        type: 'unique',
        name: 'uniqueMatchInvitation',
      }
    )
  },

  down(queryInterface) {
    return queryInterface.removeConstraint(
      'matchInvitations',
      'uniqueMatchInvitation'
    )
  },
}
