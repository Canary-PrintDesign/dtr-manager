/* globals $ */

$(document).ready(() => {
  function createNewAgent (template) {
    const agentsList = $('.js-agents')
    const agents = $('.js-agent')
    const templ = template.html().replace(/{{recordIndex}}/g, agents.length + 1)
    agentsList.append(templ)
  }

  const template = $('.js-agent-template')

  $('.js-new-record').click(() => {
    createNewAgent(template)
  })

  $('.js-delete-record').click((event) => {
    $(event.target).closest('.row').remove()
  })
})
