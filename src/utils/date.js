import moment from 'moment'
export function cal(newValue, oldValue) {
  let year, month
  const gap = newValue - oldValue
  year = gap / (365 * 24 * 60 * 60 * 1000)
  month = gap % (365 * 24 * 60 * 60 * 1000)
  month = month / (30 * 24 * 60 * 60 * 1000)
  if (month < 1) {
    month = 1
  }
  year = Math.floor(year)
  // 月向上取整
  month = Math.ceil(month)
  if (year < 1) {
    return `${month}个月`
  }
  return `${year}岁${month}个月`
}

// 日期转时间戳
export function getTimeStamp(value) {
  console.log(value)
  const date = new Date(value)
  return date.getTime()
}

export function formatTimeToServe(dateString) {
  return moment(dateString).format('YYYY-MM-DD[T]HH:mm:ss[.000Z]')
}

export function gap(dateString) {
  return moment().diff(moment(dateString), 'years')
}

export function formateSimple(dateString) {
  return moment(dateString).format('YYYY-MM-DD HH:mm:ss')
}

export function formatDateToDay(dateString) {
  return moment(dateString).format('YYYY-MM-DD')
}
