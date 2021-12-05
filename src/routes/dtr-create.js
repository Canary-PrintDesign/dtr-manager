const createError = require('http-errors')
const ParseFormValues = require('../intents/parse-form-values.js')
const GetDepartment = require('../intents/get-department.js')
const { requireCrew } = require('../lib/helper-auth.js')

module.exports = async (fastify) => {
  fastify.post('/dtr', async (req, reply) => {
    requireCrew(req.user)

    const project = req.data.project
    const {
      department: departmentId,
      date,
      entries = [],
      notes = '',
    } = ParseFormValues(req.body)

    if (!departmentId) {
      fastify.log.error('Department ID required.')

      return createError(400)
    }

    const [department] = await GetDepartment({ department: departmentId, project })

    const sessionData = {
      department,
      date,
      entries,
      notes,
      project,
    }

    req.session.set('time-report', sessionData)

    return reply.view('time-record-review', {
      title: 'Review Time Sheet',
      user: req.user,
      ...sessionData,
    })
  })
}
