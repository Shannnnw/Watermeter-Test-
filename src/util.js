export default {
  getNow: function () {
    var today = new Date()
    var dd = today.getDate()
    var mm = today.getMonth() + 1
    var yyyy = today.getFullYear()
    var hh = today.getHours()
    var min = today.getMinutes()
    var ss = today.getSeconds()
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    if (hh < 10) {
      hh = '0' + hh
    }
    if (min < 10) {
      min = '0' + min
    }
    if (ss < 10) {
      ss = '0' + ss
    }
    let now = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss
    return now
  },
  getToday: function () {
    var today = new Date()
    var dd = today.getDate()
    var mm = today.getMonth() + 1
    var yyyy = today.getFullYear()
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    let now = yyyy + '-' + mm + '-' + dd
    return now
  },
  getCGA: function (currentDate, birthdate, gaWeek, gaDay) {
    if (
      !birthdate ||
      birthdate > currentDate ||
      !gaDay > 6 ||
      !gaDay < 0 ||
      !gaWeek
    ) {
      return ''
    }
    let daysDiff = this.getDayDiff(currentDate, birthdate)
    let ageInDay = Number(gaWeek) * 7 + Number(gaDay) + daysDiff - 1
    let cgaWeek = Math.floor(ageInDay / 7)
    let cgaDay = ageInDay % 7
    return cgaWeek.toString() + '+' + cgaDay.toString()
  },
  getDayDiff: function (a, b) {
    let daysDiff = Math.abs(new Date(a) - new Date(b))
    daysDiff = Math.ceil(daysDiff / (1000 * 3600 * 24))
    return daysDiff
  }
}
