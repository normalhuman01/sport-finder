module.exports = {
  up(queryInterface) {
    return queryInterface.addConstraint('users', ['mail'], {
      type: 'unique',
      name: 'UniqueUserMail',
    })
  },

  down(queryInterface) {
    return queryInterface.removeConstraint('users', 'UniqueUserMail')
  },
}
