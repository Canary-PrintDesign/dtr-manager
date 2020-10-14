/* globals $, fetch */

$(document).ready(() => {
  function timeToBase10 (time) {
    const t = String(time).padStart(4, '0')
    const hours = String(t.slice(0, 2)).padStart(2, '0')
    const minutes = String(t.slice(2, 4) / 60 * 100).padEnd(2, '0')

    return `${hours}${minutes}`
  }

  function base10ToTime (time) {
    const t = String(time).padStart(4, '0')
    const hours = String(t.slice(0, 2)).padStart(2, '0')
    const minutes = String(t.slice(2, -1) / 100 * 60).padEnd(2, '0')

    return { hours: String(hours), minutes: String(minutes) }
  }

  function workedTime (start = '0', stop = '0', lStart, lStop) {
    const workStart = timeToBase10(start)
    const workStop = timeToBase10(stop)
    const timeDiff = String(workStop - workStart).padStart(4, '0')

    let lTimeDiff = '0000'
    if (lStart && lStop) {
      const lunchStart = timeToBase10(lStart)
      const lunchStop = timeToBase10(lStop)
      lTimeDiff = String(lunchStop - lunchStart).padStart(4, '0')
    }

    const calculatedTime = String(timeDiff - lTimeDiff).padStart(4, '0')

    return base10ToTime(calculatedTime)
  }

  function createNewAgent (template, { index, name = '', position = '' }) {
    const agentsList = $('.js-agents')
    const agents = $('.js-agent')

    const i = index || agents.length

    const tmpl = template.html()
      .replace(/{{recordIndex}}/g, i + 1)
      .replace(/{{recordName}}/g, name)
      .replace(/{{recordPosition}}/g, position)

    agentsList.append(tmpl)
  }

  function bindDeleteRecordButton () {
    $('.js-delete-record').click((event) => {
      event.preventDefault()
      $(event.target).closest('.row').remove()
    })
  }

  function calculateWorkTime (event) {
    const target = event.target
    // TODO why doesn't .parent('.js-agent') retrieve the js-agent dom object?
    const agent = $(target).parent().parent()
    const workStart = $(agent).find('.js-work-start')[0]
    const workStop = $(agent).find('.js-work-stop')[0]
    const lunchStart = $(agent).find('.js-lunch-start')[0]
    const lunchStop = $(agent).find('.js-lunch-stop')[0]

    console.log(lunchStart.value, lunchStop.value)

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

    const { hours, minutes } = workedTime(workStart.value, workStop.value, lunchStart.value, lunchStop.value)

    $(agent)
      .parent()
      .parent()
      .find('.js-calculated-time')
      .html(`Worked for ${hours}h ${minutes}m`)
  }

  const template = $('.js-agent-template')

  $('.js-new-record').click(() => {
    createNewAgent(template, {})

    bindDeleteRecordButton()
  })

  $('.js-department-select').change(async (event) => {
    $('.js-agents').children().remove()

    const departmentId = event.target.value
    const results = await fetch(`/dtr/api?department=${departmentId}`)
    const data = await results.json()

    data.agents.forEach((agent, i) => {
      createNewAgent(template, { ...agent, index: i })
    })

    bindDeleteRecordButton()
  })

  $(document).on('change', '.js-work-start', calculateWorkTime)
  $(document).on('change', '.js-work-stop', calculateWorkTime)
  $(document).on('change', '.js-lunch-start', calculateWorkTime)
  $(document).on('change', '.js-lunch-stop', calculateWorkTime)
})
