'use strict'

const { test } = require('tap')
const {
  build,
} = require('../helper')

test

test('create and get ticket', async ( t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'A support ticket',
      body: 'this is a long body'
    }
  })

  t.equal(res1.statusCode, 201) // Created
  const body1 = JSON.parse(res1.body)

  t.ok(body1._id)
  const url = `/tickets/${body1._id}`
  t.equal(res1.headers.location, url)

  const res2 = await app.inject({
    method: 'GET',
    url
  })

  t.equal(res2.statusCode, 200)

  t.deepEqual(JSON.parse(res2.body), {
    _id: body1._id,
    title: 'A support ticket',
    body: 'this is a long body'
  })
})

test('create and get all', async (t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'A support ticket',
      body: 'this is a long body'
    }
  })

  const res2 = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'Another support ticket',
      body: 'this is a long body'
    }
  })

  const body1 = JSON.parse(res1.body)
  const body2 = JSON.parse(res2.body)

  const resAll = await app.inject({
    method: 'GET',
    url: '/tickets'
  })

  t.equal(resAll.statusCode, 200)

  t.deepEqual(JSON.parse(resAll.body), {
    tickets: [{
      _id: body2._id,
      title: 'Another support ticket',
      body: 'this is a long body'
    }, {
      _id: body1._id,
      title: 'A support ticket',
      body: 'this is a long body'
    }]
  })
})

test('cannot create ticket without body', async ( t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'A support ticket'
    }
  })

  t.equal(res1.statusCode, 400)
})

test('cannot create ticket without title', async ( t) => {
  const app = build(t)
  const res1 = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      body: 'Post title'
    }
  })

  t.equal(res1.statusCode, 400)
})