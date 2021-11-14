$(document).ready(() => {
  var quill = new Quill('#editor', {
    theme: 'bubble', // Specify theme in configuration,
  })

  $('.js-notification-form').submit((event) => {
    $('<input />')
      .attr('type', 'hidden')
      .attr('name', 'notification')
      .attr('value', quill.root.innerHTML)
      .appendTo(event.target)

    return true
  })
})
