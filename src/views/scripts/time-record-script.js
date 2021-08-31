/* globals $, fetch, moment */

$(document).ready(() => {
  function workedTime(start = '0000', stop = '0000', lStart, lStop) {
    const timeDiff = moment(stop, 'HHmm') - moment(start, 'HHmm')

    let lTimeDiff = 0
    if (lStart && lStop) {
      lTimeDiff = moment(lStop, 'HHmm') - moment(lStart, 'HHmm')
    }

    const ms = timeDiff - lTimeDiff
    return moment().startOf('day').milliseconds(ms).format('H:mm').split(':')
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
      $(event.target).closest('.row').remove()
    })
  }

  function calculateWorkTime(event) {
    const target = event.target
    // TODO why doesn't .parent('.js-agent') retrieve the js-agent dom object?
    const agent = $(target).parent().parent()
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
    const results = await fetch(`/api/agents?department=${departmentId}`)
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
