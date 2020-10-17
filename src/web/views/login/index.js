/* globals $, fetch */

$(document).ready(() => {
  $('#request-auth-token').on('submit', async (e) => {
    e.preventDefault()

    const departmentId = $(e.target).find('.js-department-select').val()
    await fetch(`/api/auth-token?department=${departmentId}`)
  })
})
