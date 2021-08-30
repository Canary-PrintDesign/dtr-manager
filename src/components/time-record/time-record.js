const Repo = require('./time-record-repo')
const Component = require('../../lib/component')

exports.create = create
function create () {
  return async (props = {}) => ({
    id: props.id,
    project: props.project,
    department: props.department,
    agent: props.agent,
    date: props.date || new Date(),
    workStart: props.workStart || props.work_start,
    workStop: props.workStop || props.work_stop,
    lunchStart: props.lunchStart || props.lunch_start,
    lunchStop: props.lunchStop || props.lunch_stop
  })
}

exports.findWith =
  (repo = Repo) =>
    async (props = {}) =>
      await Component.findWith(repo, create(), props)

exports.save =
  (repo = Repo) =>
    async (props = {}) =>
      await Component.save(repo, create(), await serialize(props))

function serialize (props) {
  const data = {
    ...props,
    work_start: props.workStart,
    work_stop: props.workStop,
    lunch_start: props.lunchStart,
    lunch_stop: props.lunchStop
  }

  delete data.workStart
  delete data.workStop
  delete data.lunchStart
  delete data.lunchStop

  return data
}
