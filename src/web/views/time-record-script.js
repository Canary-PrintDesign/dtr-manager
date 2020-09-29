/* globals $, fetch */

$(document).ready(() => {
  function createNewAgent (template, { name = '', position = '' }) {
    const agentsList = $('.js-agents')
    const agents = $('.js-agent')
    const templ = template.html()
      .replace(/{{recordIndex}}/g, agents.length + 1)
      .replace(/{{recordName}}/g, name)
      .replace(/{{recordPosition}}/g, position)

    agentsList.append(templ)
  }

  const template = $('.js-agent-template')

  $('.js-new-record').click(() => {
    createNewAgent(template, {})
  })

  $('.js-delete-record').click((event) => {
    $(event.target).closest('.row').remove()
  })

  $('.js-department-select').change(async (event) => {
    $('.js-agents').children().remove()

    const departmentId = event.target.value
    const results = await fetch(`/dtr/api?department=${departmentId}`)
    const data = await results.json()

    data.agents.forEach(agent => {
      createNewAgent(template, agent)
    })
  })
})