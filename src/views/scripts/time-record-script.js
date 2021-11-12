/* globals $, fetch, moment */

function parseTime(time) {
  let [hh, mm, hhr, mmr] = [
    Number(time.slice(0, 2)),
    Number(time.slice(2)),
    0,
    0,
  ]

  if (hh > 23) {
    hhr = hh - 23
    hh = 23
  }

  if (mm > 59) {
    mmr = mm - 59
    mm = 59
  }

  return [hh, mm, hhr, mmr]
}

function calculateTime(hh, mm, hhr, mmr) {
  return moment(
    `${hh.toString().padStart(2, 0)}${mm.toString().padStart(2, 0)}`,
    'HHmm'
  )
    .add(hhr, 'hours')
    .add(mmr, 'minutes')
}

function workedTime(startTime, stopTime, startLunch, stopLunch) {
  const xStartTime = calculateTime(...parseTime(startTime))
  const xStopTime = calculateTime(...parseTime(stopTime))
  const diff = xStopTime.diff(xStartTime)

  let diffLunch = 0
  if (startLunch && stopLunch) {
    const xStartLunch = calculateTime(...parseTime(startLunch))
    const xStopLunch = calculateTime(...parseTime(stopLunch))
    diffLunch = xStopLunch.diff(xStartLunch)
  }

  return moment()
    .startOf('day')
    .milliseconds(diff - diffLunch)
    .format('HH:mm')
    .split(':')
}

function createNewAgent(template, { index, name = '', position = '' }) {
  const agentsList = $('.js-agents')
  const agents = $('.js-agent')

  const i = index || agents.length

  const tmpl = template
    .html()
    .replace(/{{entryIndex}}/g, i + 1)
    .replace(/{{entryName}}/g, name)
    .replace(/{{entryPosition}}/g, position)

  agentsList.append(tmpl)
}

function bindDeleteRecordButton() {
  $('.js-delete-record').click((event) => {
    event.preventDefault()

    const result = confirm('Remove the entry?')
    if (result) {
      $(event.target).closest('.js-time-record').remove()
    }
  })
}

function calculateWorkTime(event) {
  const target = event.target
  const agent = $(target).closest('.js-agent')
  const workStart = $(agent).find('.js-work-start')[0]
  const workStop = $(agent).find('.js-work-stop')[0]
  const lunchStart = $(agent).find('.js-lunch-start')[0]
  const lunchStop = $(agent).find('.js-lunch-stop')[0]

  // clear custom validations
  workStart.setCustomValidity('')
  workStop.setCustomValidity('')
  lunchStart.setCustomValidity('')
  lunchStop.setCustomValidity('')

  if (workStop.value < workStart.value) {
    workStart.setCustomValidity('Start must be earlier than Stop')
    workStop.setCustomValidity('Stop must be later than Start')
    return
  }

  if (lunchStart && lunchStop && lunchStop.value < lunchStart.value) {
    lunchStart.setCustomValidity('Start must be earlier than Stop')
    lunchStop.setCustomValidity('Stop must be later than Start')
  }

  const [hours, minutes] = workedTime(
    workStart.value,
    workStop.value,
    lunchStart.value,
    lunchStop.value
  )

  $(agent).find('.js-calculated-time').val(`${hours}h ${minutes}m`)
}

function bindNoCallButton() {
  $('.js-no-call').click((event) => {
    event.preventDefault()
    
    const target = event.target
    const agent = $(target).closest('.js-agent')
    const timeInputs = $(agent).find('.js-time-input')

    $(timeInputs).each((i, timeInput) => {
      $(timeInput).val('0000')
    })
  })
}

$(document).ready(() => {
  const template = $('.js-agent-template')

  $('.js-new-record').click((e) => {
    e.preventDefault()
    createNewAgent(template, {})

    bindDeleteRecordButton()
    bindNoCallButton()
  })

  $('.js-department-select').change(async (event) => {
    $('.js-agents').children().remove()

    const departmentId = event.target.value
    const results = await fetch(`/api/agents?department=${departmentId}`)
    const data = await results.json()

    data.agents.forEach((agent, i) => {
      createNewAgent(template, { ...agent, index: i })
    })

    bindDeleteRecordButton()
    bindNoCallButton()
  })

  $(document).on('change', '.js-work-start', calculateWorkTime)
  $(document).on('change', '.js-work-stop', calculateWorkTime)
  $(document).on('change', '.js-lunch-start', calculateWorkTime)
  $(document).on('change', '.js-lunch-stop', calculateWorkTime)

  bindDeleteRecordButton()
  bindNoCallButton()
})
