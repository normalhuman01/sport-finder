const axios = require('axios')
const {
  ACCESS_LEVEL,
  API_URI,
  FORMAT,
  FUTSAL_KEY,
  LANGUAGE_CODE,
  SOCCER_INTERNATIONAL_KEY,
  TENNIS_KEY,
} = require('../config/sportradar')

// BADMINTON_KEY,
// BEACH_SOCCER_KEY,
// BEACH_VOLLEYBALL_KEY,
// HANDBALL_KEY,
// SQUASH_KEY,
// VOLLEYBALL_KEY,

const fetch = async (scheme, version, key, attr, id) => {
  // console.log(
  //   `${API_URI(scheme)}/${scheme}-${ACCESS_LEVEL}${version}/${
  //     scheme === 'soccer' ? `intl/` : ''
  //   }${LANGUAGE_CODE}/${attr}${id ? `/${id}/info` : ''}.${FORMAT}?api_key=${
  //     key
  //   }`
  // )
  const req = await axios.get(
    `${API_URI(scheme)}/${scheme}-${ACCESS_LEVEL}${version}/${
      scheme === 'soccer' ? `intl/` : ''
    }${LANGUAGE_CODE}/${attr}${id ? `/${id}/info` : ''}.${FORMAT}?api_key=${
      key
    }`
  )
  return req.data
}

const getSoccer = {
  tournaments: () =>
    fetch('soccer', 3, SOCCER_INTERNATIONAL_KEY, 'tournaments'),
  tournament: id =>
    fetch('soccer', 3, SOCCER_INTERNATIONAL_KEY, 'tournaments', id),
}

const getFutsal = {
  tournaments: () => fetch('futsal', 1, FUTSAL_KEY, 'tournaments'),
  tournament: id => fetch('futsal', 1, FUTSAL_KEY, 'tournaments', id),
}

const getTennis = {
  tournaments: () => fetch('tennis', 2, TENNIS_KEY, 'tournaments'),
  tournament: id => fetch('tennis', 2, TENNIS_KEY, 'tournaments', id),
}

module.exports = {
  getSoccer,
  getFutsal,
  getTennis,
}
