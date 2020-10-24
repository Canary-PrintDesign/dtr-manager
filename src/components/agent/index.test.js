const { v4: uuid } = require('uuid')

const { create, findAll, findWith, save } = require('./index')

describe('Agent.create/1', () => {
  describe('with an empty input object', () => {
    it('should return an object with name and position attributes', async () => {
      const result = await create()

      expect(result).toEqual({ name: '', position: '' })
    })
  })

  describe('with an valid input object', () => {
    it('should return an object with the valid date as attributes', async () => {
      const data = {
        id: uuid(),
        project: uuid(),
        department: uuid(),
        name: 'test',
        position: 'test'
      }

      const result = await create(data)

      expect(result).toEqual(data)
    })

    it('should return an object without optional data as attributes', async () => {
      const data = {
        name: 'test',
        position: 'test'
      }

      const result = await create(data)

      expect(result).toEqual({ name: data.name, position: data.position })
    })
  })

  describe('with an invalid input object', () => {
    it('should return an object without extra data as attributes', async () => {
      const data = {
        name: 'test',
        position: 'test',
        testAttr: 'test'
      }

      const result = await create(data)

      expect(result).toEqual({ name: data.name, position: data.position })
    })

    it('should return an error when attribute data is invalid', async () => {
      const data = {
        id: 12345,
        name: 'test',
        position: 'test'
      }

      try {
        await create(data)
      } catch (err) {
        expect(err.message).toContain('must be a string')
      }
    })
  })
})

describe('Agent.findAll/2', () => {
  it('calls findAll on repo and returns the result', async () => {
    const repo = { findAll: jest.fn(async () => await []) }

    await findAll(null, null, repo)

    expect(repo.findAll).toHaveBeenCalled()
  })
})

describe('Agent.findWith/1', () => {
  it('calls findByProp on repo and returns the result', async () => {
    const repo = { findWith: jest.fn(async () => await []) }
    const agent = 'test'

    await findWith({ agent }, repo)

    expect(repo.findWith).toHaveBeenCalled()
  })
})

describe('Agent.save/1', () => {
  it('calls store on repo and returns the result', async () => {
    const repo = { store: jest.fn(async () => await []) }
    const agent = 'test'

    await save({ agent }, repo)

    expect(repo.store).toHaveBeenCalled()
  })
})
