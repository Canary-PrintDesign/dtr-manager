import alert from 'cli-alerts'

export function success(name, msg) {
  alert({
    type: 'success',
    name,
    msg,
  })
}

export function error(name, msg) {
  alert({
    type: 'error',
    name,
    msg,
  })
}

export function warn(name, msg) {
  alert({
    type: 'warning',
    name,
    msg,
  })
}

export function info(name, msg) {
  alert({
    type: 'info',
    name,
    msg,
  })
}
