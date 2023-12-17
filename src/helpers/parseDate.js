const moment = require('moment')

module.exports = function parseDate(date) {
  const dt = moment(date)
    .format('ddd D [de] MMMM YYYY, H:mm')
    .replace('Mon', 'Lun')
    .replace('Tue', 'Mar')
    .replace('Wed', 'Mie')
    .replace('Thu', 'Jue')
    .replace('Fri', 'Vie')
    .replace('Sat', 'Sab')
    .replace('Sun', 'Dom')
    .replace('January', 'Enero')
    .replace('February', 'Febrero')
    .replace('March', 'Marzo')
    .replace('April', 'Abril')
    .replace('May', 'Mayo')
    .replace('June', 'Junio')
    .replace('July', 'Julio')
    .replace('August', 'Agosto')
    .replace('September', 'Septiembre')
    .replace('October', 'Octubre')
    .replace('November', 'Noviembre')
    .replace('December', 'Diciembre')
  return dt
}
