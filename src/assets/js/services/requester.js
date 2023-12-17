/* eslint-disable */

async function jsonRequest(path, options = {}) {
  console.log(`Requesting with: \n ${options.body}`) //eslint-disable-line no-console
  const result = await fetch(path, {
    ...options,
    headers: {
      ...options.headers,
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
  const json = await result.json()
  if (result.status !== 200) {
    throw Object.assign(new Error(), json)
  }
  return json
}

export default {
  async getSports(clubId) {
    return jsonRequest(`/clubs/${clubId}`)
  },
  async putSport(clubId, sportData = {}) {
    return jsonRequest(`/clubs/${clubId}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sportData),
    })
  },
  async deleteSport(clubId, sportId, sportData = {}) {
    return jsonRequest(`/clubs/${clubId}/sports/${sportId}`, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sportData),
    })
  },
  async getNotifications() {
    return jsonRequest(`/profile`)
  },
  async acceptNotification(acceptUrl, data) {
    return jsonRequest(acceptUrl, {
      method: 'post',
      headers: { 'Content-Type': 'application/json ' },
      body: JSON.stringify(data),
    })
  },
  async declineNotification(declineUrl) {
    return jsonRequest(declineUrl, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json ' },
    })
  },
}
