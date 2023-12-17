module.exports = function checkCaptain(userTeamArr, currentUser) {
  let isCaptain = false
  userTeamArr.forEach(member => {
    if (member.userId === currentUser.id && member.captain) {
      isCaptain = true
    }
  })
  return isCaptain
}
