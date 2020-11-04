const test = require('tape')

const Project = require('components/project')

// const { requestAgents } = require('web/controllers/api')

test('responds to api request for agents', async t => {
  // const req = {
  //   context: { project: "id" },
  //   query: { department: "dept" }
  // }

  // const res = {}

  const project = await createProject()
  console.log(project)
  // const x = await requestAgents(req, res)
  t.end()
})

async function createProject () {
  const project = Project.create({
    name: 'Test Project',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    hostname: 'localhost'
  })

  return await Project.save(await project)
}

function createDepartment () {

}

function createAgent () {

}
