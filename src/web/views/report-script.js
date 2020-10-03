/* globals $ */
$(document).ready(() => {
  $('.js-date-filter').change(event => {
    $('[data-report-row]').each((_i, el) => {
      const rowDate = $(el).data('report-date')
      $(el).addClass('sr-only')

      if (rowDate === event.target.value) $(el).removeClass('sr-only')
    })
  })
})
