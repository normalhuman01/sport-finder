module.exports = {
  up(queryInterface) {
    return queryInterface.addConstraint(
      'teamInvitations',
      ['userId', 'teamId'],
      {
        type: 'unique',
        name: 'uniqueTeamInvitation',
      }
    )
  },

  down(queryInterface) {
    return queryInterface.removeConstraint(
      'teamInvitations',
      'uniqueTeamInvitation'
    )
  },
}
