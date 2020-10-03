/* globals $ */
$(document).ready(() => {
  $('.js-date-filter, .js-department-filter').change(event => {
    const filterDate = $('.js-date-filter')[0].value
    const filterDepartment = $('.js-department-filter')[0].value

    $('[data-report-row]').each((_i, el) => {
      const rowDate = $(el).data('report-date')
      const rowDepartment = $(el).data('report-department')

      $(el).addClass('sr-only')

      if (filterDate === rowDate && filterDepartment === rowDepartment) {
        $(el).removeClass('sr-only')
      } else if (filterDate === rowDate && filterDepartment === '') {
        $(el).removeClass('sr-only')
      } else if (filterDate === '' && filterDepartment === rowDepartment) {
        $(el).removeClass('sr-only')
      }
    })
  })
})
