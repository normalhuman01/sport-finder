const config = {
  ACCESS_LEVEL: 't',
  API_URI: scheme =>
    scheme === 'soccer'
      ? 'https://api.sportradar.us'
      : 'http://api.sportradar.com',
  FORMAT: 'json',
  LANGUAGE_CODE: 'en',
}

const keys = {
  BADMINTON_KEY: process.env.SR_BADMINTON,
  BEACH_SOCCER_KEY: process.env.SR_BEACH_SOCC,
  BEACH_VOLLEYBALL_KEY: process.env.SR_BEACH_VOLLEYBALL,
  FUTSAL_KEY: process.env.SR_FUTSAL,
  HANDBALL_KEY: process.env.SR_HANDBALL,
  SOCCER_INTERNATIONAL_KEY: process.env.SR_SOCCER_INTERNATIONAL,
  SQUASH_KEY: process.env.SR_SQUASH,
  TENNIS_KEY: process.env.SR_TENNIS,
  VOLLEYBALL_KEY: process.env.SR_VOLLEYBALL,
}

module.exports = { ...config, ...keys }
