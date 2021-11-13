/* globals $, fetch */

function parseTime(time) {
  const hh = Number(time.slice(0, 2))
  const mm = Number(time.slice(2))
  
  return (hh * 60) + mm
}

function calculateTime(time1, time2) {
  console.log({ time1, time2 })
  return parseTime(time2) - parseTime(time1)
}

function calculateTimeWorked(startTime, stopTime, startLunch = '0000', stopLunch = '0000') {
  const work = calculateTime(startTime, stopTime)
  const lunch = calculateTime(startLunch, stopLunch)
  
  const timeWorked = work - lunch
  
  let hours = Math.floor(timeWorked / 60)
  let minutes = timeWorked % 60
  if (hours < 0) hours = 24 + hours
  if (minutes < 0) minutes = 60 + minutes
  
  console.log({ timeWorked })
  
  return [hours, minutes]
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

  if (
    [
      $(workStart).val(),
      $(workStop).val(),
      $(lunchStart).val(),
      $(lunchStop).val(),
    ].includes('N/C')
  ) {
    $(agent).find('.js-calculated-time').val(`No Call`)
    return
  }

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

  const [hours, minutes] = calculateTimeWorked(workStart.value, workStop.value, lunchStart.value, lunchStop.value)

  const time = `${hours}h ${minutes.toString().padStart(2, '0')}m`
  $(agent).find('.js-calculated-time').val(time)
  
}

function bindNoCallButton() {
  $('.js-no-call').click((event) => {
    event.preventDefault()

    const target = event.target
    const agent = $(target).closest('.js-agent')
    const timeInputs = $(agent).find('.js-time-input')

    $(timeInputs).each((i, timeInput) => {
      $(timeInput).val('N/C')
    })

    calculateWorkTime(event)
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
