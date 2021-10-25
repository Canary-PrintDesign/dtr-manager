/* globals $ */
$(document).ready(() => {
  $('.js-date-filter, .js-department-filter').change(() => {
    const filterDate = $('.js-date-filter')[0].value
    const filterDepartment = $('.js-department-filter')[0]?.value

    $('[data-report-row]').each((_i, el) => {
      const rowDate = $(el).data('report-date')
      const rowDepartment = filterDepartment
        ? $(el).data('report-department')
        : filterDepartment

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
