/* globals $ */
$(document).ready(() => {
  $('.js-date-filter, .js-department-filter').change((event) => {
    const filterDate = $('.js-date-filter')[0].value
    const filterDepartment = $('.js-department-filter')[0].value

    $('[data-report-row]').each((_i, el) => {
      const rowDate = $(el).data('report-date')
      const rowDepartment = $(el).data('report-department')

      $(el).addClass('d-none')

      if (
        (filterDate === '' || filterDate === rowDate) &&
        (filterDepartment === '' || filterDepartment === rowDepartment)
      ) {
        $(el).removeClass('d-none')
      }
    })
  })
})
